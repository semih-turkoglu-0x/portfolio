"use server";

import { headers } from "next/headers";
import { Resend } from "resend";

import { redis } from "@/lib/redis";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: { name?: string; email?: string; message?: string };
  values?: { name: string; email: string; message: string };
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TO = process.env.CONTACT_TO_EMAIL ?? "semih.trkgl99@gmail.com";
const FROM = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

// Drop C0 control characters (codes < 32, incl. CR/LF) and DEL (127) from the
// name — it lands in the email subject, so this guards against header tricks.
function stripControlChars(value: string): string {
  let out = "";
  for (const ch of value) {
    const code = ch.charCodeAt(0);
    if (code > 31 && code !== 127) out += ch;
  }
  return out;
}

// Reuses the shared Upstash client. No-ops when Redis isn't configured (dev).
async function withinRateLimit(ip: string) {
  if (!redis || !ip) return true;
  const key = `contact:rl:${ip}`;
  const hits = await redis.incr(key);
  if (hits === 1) await redis.expire(key, 3600);
  return hits <= 5; // 5 messages per IP per hour
}

export async function sendMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: bots fill hidden fields. Pretend success and silently drop.
  if (formData.get("company")) return { status: "success" };

  const name = stripControlChars(String(formData.get("name") ?? "")).trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const values = { name, email, message };

  const errors: NonNullable<ContactState["errors"]> = {};
  if (name.length < 1 || name.length > 100) {
    errors.name = "Please enter your name.";
  }
  if (!EMAIL_RE.test(email) || email.length > 200) {
    errors.email = "Please enter a valid email address.";
  }
  if (message.length < 10) {
    errors.message = "Please write at least a sentence (10+ characters).";
  } else if (message.length > 5000) {
    errors.message = "That's a bit long — keep it under 5000 characters.";
  }
  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, values };
  }

  const hdrs = await headers();
  const ip = (hdrs.get("x-forwarded-for") ?? "").split(",")[0]?.trim() ?? "";
  if (!(await withinRateLimit(ip))) {
    return {
      status: "error",
      values,
      message: "You've sent several messages already — please try again later.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      status: "error",
      values,
      message: "The form isn't fully configured yet. Please email me directly for now.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Portfolio contact — ${name}`,
      text: [
        "New message from your portfolio contact form.",
        "",
        `Name:  ${name}`,
        `Email: ${email}  (reply-to — entered by the sender, NOT verified)`,
        "",
        message,
      ].join("\n"),
    });
    if (error) {
      return {
        status: "error",
        values,
        message: "Something went wrong sending your message. Please email me directly.",
      };
    }
  } catch {
    return {
      status: "error",
      values,
      message: "Something went wrong sending your message. Please email me directly.",
    };
  }

  return { status: "success" };
}

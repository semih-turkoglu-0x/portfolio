"use client";

import { useActionState, useState, type ReactNode } from "react";

import { sendMessage, type ContactState } from "@/app/contact/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const INITIAL: ContactState = { status: "idle" };
const MAX_MESSAGE = 5000;

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {hint ? (
          <span className="text-xs tabular-nums text-muted-foreground">{hint}</span>
        ) : null}
      </div>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(sendMessage, INITIAL);
  const [count, setCount] = useState(0);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-3 rounded-xl border border-border bg-card/40 p-8"
      >
        <span className="font-mono text-sm text-muted-foreground">
          message sent ✓
        </span>
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Thanks — it&apos;s on its way.
        </h2>
        <p className="max-w-prose text-base leading-7 text-muted-foreground">
          I read everything that lands in my inbox and I&apos;ll get back to you
          soon.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {state.message}
        </p>
      ) : null}

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="name" error={state.errors?.name}>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Ada Lovelace"
            defaultValue={state.values?.name}
            aria-invalid={Boolean(state.errors?.name)}
            aria-describedby={state.errors?.name ? "name-error" : undefined}
            required
          />
        </Field>
        <Field label="Email" htmlFor="email" error={state.errors?.email}>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="ada@example.com"
            defaultValue={state.values?.email}
            aria-invalid={Boolean(state.errors?.email)}
            aria-describedby={state.errors?.email ? "email-error" : undefined}
            required
          />
        </Field>
      </div>

      <Field
        label="Message"
        htmlFor="message"
        error={state.errors?.message}
        hint={`${count} / ${MAX_MESSAGE}`}
      >
        <Textarea
          id="message"
          name="message"
          rows={6}
          maxLength={MAX_MESSAGE}
          placeholder="What's on your mind?"
          defaultValue={state.values?.message}
          onChange={(event) => setCount(event.target.value.length)}
          aria-invalid={Boolean(state.errors?.message)}
          aria-describedby={state.errors?.message ? "message-error" : undefined}
          required
        />
      </Field>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? "Sending…" : "Send message"}
        </Button>
        <span className="text-sm text-muted-foreground">
          Prefer email?{" "}
          <a
            href="mailto:semih.trkgl99@gmail.com"
            className="font-medium text-foreground underline underline-offset-4"
          >
            semih.trkgl99@gmail.com
          </a>
        </span>
      </div>
    </form>
  );
}

import type { Metadata } from "next";

import Link from "next/link";

import { DecodeLine } from "@/components/decode-line";

export const metadata: Metadata = {
  title: "About — Semih Turkoglu",
  description: "A little about Semih Turkoglu.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="flex flex-1 items-center px-6 py-24">
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            About
          </h1>
          <DecodeLine roles={["software developer", "security-minded builder", "homelab tinkerer", "motorsport lover", "gym-rat"]} />
        </div>

        <p className="max-w-prose text-base leading-7 text-muted-foreground">
          Hi, I'm Semih — a software developer based in Belgium, freshly graduated in computer science with a background in business engineering and a security internship at Deloitte under my belt.

I'm currently looking for my next ICT role. Feel free to{" "}
          <Link
          href="/contact"
          className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            reach out
            </Link>
            .
        </p>
      </section>
    </main>
  );
}

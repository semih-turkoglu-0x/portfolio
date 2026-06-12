import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Semih Turkoglu",
  description: "A little about Semih Turkoglu.",
};

export default function AboutPage() {
  return (
    <main className="flex flex-1 items-center px-6 py-24">
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          About
        </h1>
        <p className="max-w-prose text-base leading-7 text-muted-foreground">
          {/* TODO: write your about page */}
          More about me, coming soon.
        </p>
      </section>
    </main>
  );
}

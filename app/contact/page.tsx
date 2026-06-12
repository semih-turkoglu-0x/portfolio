import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Semih Turkoglu",
  description: "Get in touch with Semih Turkoglu.",
};

export default function ContactPage() {
  return (
    <main className="flex flex-1 items-center px-6 py-24">
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Contact
        </h1>
        <p className="max-w-prose text-base leading-7 text-muted-foreground">
          The best way to reach me is by email at{" "}
          <a
            href="mailto:semih.trkgl99@gmail.com"
            className="font-medium text-foreground underline underline-offset-4"
          >
            semih.trkgl99@gmail.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}

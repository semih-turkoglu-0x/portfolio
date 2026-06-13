import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact — Semih Turkoglu",
  description: "Get in touch with Semih Turkoglu.",
};

export default function ContactPage() {
  return (
    <main className="flex flex-1 items-start px-6 py-24">
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Contact
          </h1>
          <p className="max-w-prose text-base leading-7 text-muted-foreground">
            Have a question, an opportunity, or just want to say hi? Send me a
            message and it&apos;ll land straight in my inbox.
          </p>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}

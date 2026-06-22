import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { LatestPosts } from "@/components/latest-posts";
import { Button } from "@/components/ui/button";
import { siteUrl } from "@/lib/site";

// TODO: swap these placeholders for your real details
const NAME = "Semih Turkoglu";
const TAGLINE = "Software developer";
const BIO_BEFORE =
  "I build things for the web and write about what I learn along the way. This is my corner of the internet — part portfolio, part ";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/semih-turkoglu-0x" },
  { label: "Email", href: "mailto:semih.trkgl99@gmail.com" },
];

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: NAME,
  url: siteUrl,
  jobTitle: TAGLINE,
  sameAs: SOCIALS.filter((s) => s.href.startsWith("http")).map((s) => s.href),
};

export default async function Home() {
  return (
    <main className="flex flex-1 items-center px-6 py-24">
      <JsonLd data={personLd} />
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {NAME}
          </h1>
          <p className="text-lg font-medium text-muted-foreground">{TAGLINE}</p>
        </div>

        <p className="max-w-prose text-base leading-7 text-muted-foreground">
          {BIO_BEFORE}
          <Link
            href="/blog"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            notebook
          </Link>
          .
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" nativeButton={false} render={<Link href="/blog" />}>
            Read the blog
          </Button>
          {SOCIALS.map((social) => (
            <Button
              key={social.label}
              size="lg"
              variant="ghost"
              nativeButton={false}
              render={
                <a href={social.href} target="_blank" rel="noopener noreferrer" />
              }
            >
              {social.label}
            </Button>
          ))}
        </div>

        <LatestPosts />
      </section>
    </main>
  );
}

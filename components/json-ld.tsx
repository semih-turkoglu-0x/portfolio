// Renders a schema.org JSON-LD block. Safe to use in Server Components.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here (no user-controlled HTML).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

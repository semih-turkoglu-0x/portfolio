"use client";

import { useEffect, useState } from "react";

// Curated, code-flavored glyph pool — enough texture to read as "computing",
// restrained enough to stay on-brand.
const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789/\\<>{}[]=+*;:".split("");
const randGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

type Cell = { ch: string; locked: boolean };
const toCells = (text: string): Cell[] =>
  text.split("").map((ch) => ({ ch, locked: true }));

export function DecodeLine({
  prefix = "I’m a ",
  roles = ["software engineer", "writer", "perpetual tinkerer"],
  hold = 2600,
}: {
  prefix?: string;
  roles?: string[];
  hold?: number;
}) {
  // First role, fully resolved — identical on server and client (no hydration
  // mismatch; real text for no-JS and screen readers).
  const [cells, setCells] = useState<Cell[]>(() => toCells(roles[0]));

  useEffect(() => {
    if (
      roles.length < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let cancelled = false;
    let raf = 0;
    let timer: ReturnType<typeof setTimeout>;
    let current = roles[0];
    let index = 0;

    const scrambleTo = (target: string) =>
      new Promise<void>((resolve) => {
        const from = current;
        const len = Math.max(from.length, target.length);
        const startAt: number[] = [];
        const endAt: number[] = [];
        for (let i = 0; i < len; i++) {
          const start = i * 28 + Math.random() * 90; // left-to-right cascade
          startAt[i] = start;
          endAt[i] = start + 240 + Math.random() * 280;
        }
        const finish = Math.max(...endAt);
        const t0 = performance.now();
        let lastPaint = -Infinity;

        const step = (now: number) => {
          if (cancelled) return;
          const t = now - t0;
          // Throttle repaints (~22fps) so glyphs read as "computing", not flicker.
          if (t - lastPaint >= 45) {
            lastPaint = t;
            const next: Cell[] = [];
            for (let i = 0; i < len; i++) {
              const tgt = target[i] ?? "";
              if (t >= endAt[i]) {
                if (tgt) next.push({ ch: tgt, locked: true }); // resolved (or dropped)
              } else if (t < startAt[i]) {
                const prev = from[i];
                next.push(
                  prev
                    ? { ch: prev, locked: true }
                    : { ch: randGlyph(), locked: false },
                );
              } else {
                next.push({ ch: randGlyph(), locked: false });
              }
            }
            setCells(next);
          }
          if (t >= finish) {
            setCells(toCells(target));
            current = target;
            resolve();
          } else {
            raf = requestAnimationFrame(step);
          }
        };
        raf = requestAnimationFrame(step);
      });

    const next = async () => {
      if (cancelled) return;
      index = (index + 1) % roles.length;
      await scrambleTo(roles[index]);
      if (cancelled) return;
      timer = setTimeout(next, hold);
    };
    timer = setTimeout(next, hold); // hold the first role before the first cycle

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [roles, hold]);

  return (
    <p className="font-mono text-lg text-muted-foreground">
      <span className="sr-only">
        {prefix}
        {roles.join(", ")}.
      </span>
      <span aria-hidden="true">
        {prefix}
        {cells.map((cell, i) => (
          <span
            key={i}
            className={cell.locked ? "text-foreground" : "text-muted-foreground/50"}
          >
            {cell.ch}
          </span>
        ))}
        <span className="ml-0.5 text-foreground motion-safe:animate-[decode-blink_1.1s_step-end_infinite]">
          ▌
        </span>
      </span>
    </p>
  );
}

import { Redis } from "@upstash/redis";

// Upstash via the Vercel Marketplace injects either UPSTASH_REDIS_REST_* or the
// legacy KV_REST_API_* names. Support both.
const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

// `null` when Redis isn't configured. Callers fall back to an in-memory store,
// which is fine for local dev but resets on restart and isn't shared across
// serverless instances — so set the env vars before relying on it in production.
export const redis = url && token ? new Redis({ url, token }) : null;

import { redis } from "./redis";

export type LikeState = { count: number; liked: boolean };

// Each post's likers are stored as a set of opaque visitor ids, so the count is
// the set's cardinality and "liked" is membership. This keeps the counter and
// the de-dupe list in sync and makes toggling trivial.
const votersKey = (slug: string) => `likes:voters:${slug}`;

// In-memory fallback used only when Redis isn't configured (local dev).
const memory = new Map<string, Set<string>>();
function memVoters(slug: string) {
  let set = memory.get(slug);
  if (!set) {
    set = new Set();
    memory.set(slug, set);
  }
  return set;
}

export async function getLikes(
  slug: string,
  visitorId: string,
): Promise<LikeState> {
  if (redis) {
    const [count, member] = await Promise.all([
      redis.scard(votersKey(slug)),
      visitorId ? redis.sismember(votersKey(slug), visitorId) : Promise.resolve(0),
    ]);
    return { count: Number(count) || 0, liked: member === 1 };
  }

  const voters = memVoters(slug);
  return { count: voters.size, liked: visitorId ? voters.has(visitorId) : false };
}

export async function toggleLike(
  slug: string,
  visitorId: string,
): Promise<LikeState> {
  if (redis) {
    const wasLiked = (await redis.sismember(votersKey(slug), visitorId)) === 1;
    if (wasLiked) await redis.srem(votersKey(slug), visitorId);
    else await redis.sadd(votersKey(slug), visitorId);
    const count = Number(await redis.scard(votersKey(slug))) || 0;
    return { count, liked: !wasLiked };
  }

  const voters = memVoters(slug);
  const wasLiked = voters.has(visitorId);
  if (wasLiked) voters.delete(visitorId);
  else voters.add(visitorId);
  return { count: voters.size, liked: !wasLiked };
}

// Light per-IP throttle so the toggle endpoint can't be hammered. No-ops when
// Redis isn't configured (local dev).
export async function allowLike(ip: string): Promise<boolean> {
  if (!redis || !ip) return true;
  const key = `likes:rl:${ip}`;
  const hits = await redis.incr(key);
  if (hits === 1) await redis.expire(key, 60);
  return hits <= 30; // 30 toggles per IP per minute
}

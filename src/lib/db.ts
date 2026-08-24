import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | null = null;

/**
 * Lazily-created Neon client. Resolved per call rather than at module load so a
 * build without DATABASE_URL still succeeds — engagement endpoints degrade to
 * "unavailable" instead of failing the whole deploy.
 */
export function db() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. See .env.example.");
  }
  if (!client) {
    client = neon(url);
  }
  return client;
}

export function isDbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

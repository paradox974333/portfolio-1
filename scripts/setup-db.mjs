import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");

// Load .env.local / .env without adding a dependency.
for (const file of [".env.local", ".env"]) {
  const full = path.join(root, file);
  if (!existsSync(full)) continue;
  for (const line of readFileSync(full, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Copy .env.example to .env.local first.");
  process.exit(1);
}

const schema = readFileSync(path.join(root, "src/lib/schema.sql"), "utf8");

// The Neon HTTP driver runs one statement per round trip.
const statements = schema
  .split("\n")
  .filter((line) => !line.trim().startsWith("--"))
  .join("\n")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

const sql = neon(process.env.DATABASE_URL);

for (const statement of statements) {
  const label = statement.split("\n")[0].slice(0, 60);
  try {
    await sql.query(statement);
    console.log(`  ok  ${label}`);
  } catch (error) {
    console.error(`fail  ${label}\n      ${error.message}`);
    process.exit(1);
  }
}

console.log(`\nApplied ${statements.length} statements.`);

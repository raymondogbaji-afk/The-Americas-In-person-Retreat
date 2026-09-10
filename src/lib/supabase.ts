import { neon } from "@neondatabase/serverless";

function getEnv(key: string): string {
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key]!;
  }
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key] as string;
  }
  throw new Error(`Missing environment variable: ${key}`);
}

const databaseUrl = getEnv("DATABASE_URL");

export const sql = neon(databaseUrl);

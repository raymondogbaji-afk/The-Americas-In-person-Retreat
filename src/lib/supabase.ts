import { createClient } from "@supabase/supabase-js";

function getEnv(key: string): string {
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key]!;
  }
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key] as string;
  }
  throw new Error(`Missing environment variable: ${key}`);
}

const url = getEnv("VITE_SUPABASE_URL");
const key = getEnv("VITE_SUPABASE_ANON_KEY");

export const supabase = createClient(url, key);

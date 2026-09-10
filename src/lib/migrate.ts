import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { resolve } from "path";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("Missing DATABASE_URL environment variable");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function migrate() {
  console.log("Creating registrations table...");

  await sql`
    CREATE TABLE IF NOT EXISTS registrations (
      id SERIAL PRIMARY KEY,
      unique_id VARCHAR(20) UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      country TEXT NOT NULL DEFAULT '',
      state TEXT NOT NULL DEFAULT '',
      spouse_attending TEXT NOT NULL DEFAULT 'no',
      children TEXT NOT NULL DEFAULT '',
      room_preference TEXT NOT NULL DEFAULT 'single',
      room_preference_other TEXT NOT NULL DEFAULT '',
      accessibility_needs TEXT NOT NULL DEFAULT 'no',
      accessibility_details TEXT NOT NULL DEFAULT '',
      dietary TEXT NOT NULL DEFAULT 'none',
      dietary_other TEXT NOT NULL DEFAULT '',
      willing_testimony TEXT NOT NULL DEFAULT 'no',
      willing_lead TEXT NOT NULL DEFAULT 'no',
      has_talent TEXT NOT NULL DEFAULT 'no',
      talent_details TEXT NOT NULL DEFAULT '',
      fee TEXT NOT NULL DEFAULT 'single',
      payment_method TEXT NOT NULL DEFAULT 'paypal',
      payment_status TEXT NOT NULL DEFAULT 'pending',
      paypal_transaction_id TEXT,
      consent BOOLEAN NOT NULL DEFAULT false,
      checked_in BOOLEAN NOT NULL DEFAULT false,
      checked_in_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  console.log("Table created successfully!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

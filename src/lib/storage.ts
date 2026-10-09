import { sql } from "./supabase";

export type PaymentStatus = "pending" | "paid";

export interface Registration {
  id: string;
  uniqueId: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  spouseAttending: "" | "yes" | "no";
  children: string;
  roomPreference: "" | "single" | "double" | "other";
  roomPreferenceOther: string;
  accessibilityNeeds: "" | "yes" | "no";
  accessibilityDetails: string;
  dietary: "" | "none" | "vegetarian" | "gluten-free" | "other";
  dietaryOther: string;
  willingTestimony: "" | "yes" | "no";
  willingLead: "" | "yes" | "no";
  hasTalent: "" | "yes" | "no";
  talentDetails: string;
  fee: "single" | "couple";
  paymentMethod: "" | "check" | "transfer" | "paypal";
  paymentStatus: PaymentStatus;
  paypalTransactionId: string | null;
  consent: boolean;
  checkedIn: boolean;
  checkedInAt: string | null;
  emailSentAt: string | null;
  createdAt: string;
}

type DbRow = {
  id: string;
  unique_id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  spouse_attending: string;
  children: string;
  room_preference: string;
  room_preference_other: string;
  accessibility_needs: string;
  accessibility_details: string;
  dietary: string;
  dietary_other: string;
  willing_testimony: string;
  willing_lead: string;
  has_talent: string;
  talent_details: string;
  fee: string;
  payment_method: string;
  payment_status: string | null;
  paypal_transaction_id: string | null;
  consent: boolean;
  checked_in: boolean;
  checked_in_at: string | null;
  email_sent_at: string | null;
  created_at: string;
};

function toCamelCase(row: DbRow): Registration {
  return {
    id: row.id,
    uniqueId: row.unique_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    country: row.country ?? "",
    state: row.state,
    spouseAttending: row.spouse_attending as Registration["spouseAttending"],
    children: row.children,
    roomPreference: row.room_preference as Registration["roomPreference"],
    roomPreferenceOther: row.room_preference_other,
    accessibilityNeeds: row.accessibility_needs as Registration["accessibilityNeeds"],
    accessibilityDetails: row.accessibility_details,
    dietary: row.dietary as Registration["dietary"],
    dietaryOther: row.dietary_other,
    willingTestimony: row.willing_testimony as Registration["willingTestimony"],
    willingLead: row.willing_lead as Registration["willingLead"],
    hasTalent: row.has_talent as Registration["hasTalent"],
    talentDetails: row.talent_details,
    fee: row.fee as Registration["fee"],
    paymentMethod: row.payment_method as Registration["paymentMethod"],
    paymentStatus: (row.payment_status as PaymentStatus) ?? "pending",
    paypalTransactionId: row.paypal_transaction_id ?? null,
    consent: row.consent,
    checkedIn: row.checked_in,
    checkedInAt: row.checked_in_at,
    emailSentAt: row.email_sent_at,
    createdAt: row.created_at,
  };
}

function generateId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "CMDA-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createRegistration(
  data: Omit<
    Registration,
    | "id"
    | "uniqueId"
    | "paymentStatus"
    | "paypalTransactionId"
    | "checkedIn"
    | "checkedInAt"
    | "createdAt"
  > & {
    consent?: boolean;
  },
): Promise<Registration> {
  const uniqueId = generateId();
  const rows = await sql`
    INSERT INTO registrations (
      unique_id, name, email, phone, country, state,
      spouse_attending, children,
      room_preference, room_preference_other,
      accessibility_needs, accessibility_details,
      dietary, dietary_other,
      willing_testimony, willing_lead,
      has_talent, talent_details,
      fee, payment_method, payment_status, consent
    ) VALUES (
      ${uniqueId}, ${data.name}, ${data.email}, ${data.phone}, ${data.country}, ${data.state},
      ${data.spouseAttending}, ${data.children},
      ${data.roomPreference}, ${data.roomPreferenceOther},
      ${data.accessibilityNeeds}, ${data.accessibilityDetails},
      ${data.dietary}, ${data.dietaryOther},
      ${data.willingTestimony}, ${data.willingLead},
      ${data.hasTalent}, ${data.talentDetails},
      ${data.fee}, ${data.paymentMethod}, 'pending', ${data.consent ?? false}
    )
    RETURNING *
  `;
  return toCamelCase(rows[0] as DbRow);
}

export async function getRegistrationById(id: string): Promise<Registration | null> {
  const rows = await sql`SELECT * FROM registrations WHERE unique_id = ${id}`;
  if (rows.length === 0) return null;
  return toCamelCase(rows[0] as DbRow);
}

export async function getAllRegistrations(): Promise<Registration[]> {
  const rows = await sql`SELECT * FROM registrations ORDER BY created_at DESC`;
  return (rows as unknown as DbRow[]).map(toCamelCase);
}

export async function markCheckedIn(id: string): Promise<Registration | null> {
  const rows = await sql`
    UPDATE registrations
    SET checked_in = true, checked_in_at = ${new Date().toISOString()}
    WHERE unique_id = ${id}
    RETURNING *
  `;
  if (rows.length === 0) return null;
  return toCamelCase(rows[0] as DbRow);
}

export async function markAsPaid(
  uniqueId: string,
  paypalTransactionId?: string,
): Promise<Registration | null> {
  let rows;
  if (paypalTransactionId) {
    rows = await sql`
      UPDATE registrations
      SET payment_status = 'paid', paypal_transaction_id = ${paypalTransactionId}
      WHERE unique_id = ${uniqueId}
      RETURNING *
    `;
  } else {
    rows = await sql`
      UPDATE registrations
      SET payment_status = 'paid'
      WHERE unique_id = ${uniqueId}
      RETURNING *
    `;
  }
  if (rows.length === 0) return null;
  return toCamelCase(rows[0] as DbRow);
}

export async function getRegistrationStats(): Promise<{
  total: number;
  checkedIn: number;
  pending: number;
  paid: number;
  unpaid: number;
  single: number;
  couple: number;
}> {
  const rows = await sql`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE checked_in = true)::int AS "checkedIn",
      COUNT(*) FILTER (WHERE checked_in = false)::int AS pending,
      COUNT(*) FILTER (WHERE payment_status = 'paid')::int AS paid,
      COUNT(*) FILTER (WHERE payment_status = 'pending')::int AS unpaid,
      COUNT(*) FILTER (WHERE fee = 'single')::int AS single,
      COUNT(*) FILTER (WHERE fee = 'couple')::int AS couple
    FROM registrations
  `;
  return rows[0] as unknown as {
    total: number;
    checkedIn: number;
    pending: number;
    paid: number;
    unpaid: number;
    single: number;
    couple: number;
  };
}

export async function getRegistrationsForQrEmail(
  force: boolean,
  limit: number,
  offset = 0,
): Promise<Registration[]> {
  const rows = force
    ? await sql`
        SELECT * FROM registrations
        WHERE email <> ''
        ORDER BY created_at
        LIMIT ${limit} OFFSET ${offset}
      `
    : await sql`
        SELECT * FROM registrations
        WHERE email <> '' AND email_sent_at IS NULL
        ORDER BY created_at
        LIMIT ${limit}
      `;
  return (rows as unknown as DbRow[]).map(toCamelCase);
}

export async function markQrEmailsSent(uniqueIds: string[]): Promise<void> {
  if (uniqueIds.length === 0) return;
  await sql`
    UPDATE registrations
    SET email_sent_at = NOW()
    WHERE unique_id = ANY(${uniqueIds})
  `;
}

export async function getQrEmailStatus(): Promise<{ pending: number; total: number }> {
  const rows = await sql`
    SELECT
      COUNT(*) FILTER (WHERE email <> '' AND email_sent_at IS NULL)::int AS pending,
      COUNT(*) FILTER (WHERE email <> '')::int AS total
    FROM registrations
  `;
  return rows[0] as unknown as { pending: number; total: number };
}

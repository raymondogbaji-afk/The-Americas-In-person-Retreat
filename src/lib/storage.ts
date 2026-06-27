import { supabase } from "./supabase";

export interface Registration {
  id: string;
  uniqueId: string;
  name: string;
  email: string;
  phone: string;
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
  paymentMethod: "" | "check" | "transfer" | "card";
  consent: boolean;
  checkedIn: boolean;
  checkedInAt: string | null;
  createdAt: string;
}

type DbRow = {
  id: string;
  unique_id: string;
  name: string;
  email: string;
  phone: string;
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
  consent: boolean;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
};

function toCamelCase(row: DbRow): Registration {
  return {
    id: row.id,
    uniqueId: row.unique_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
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
    consent: row.consent,
    checkedIn: row.checked_in,
    checkedInAt: row.checked_in_at,
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
  data: Omit<Registration, "id" | "uniqueId" | "checkedIn" | "checkedInAt" | "createdAt"> & {
    consent?: boolean;
  },
): Promise<Registration> {
  const uniqueId = generateId();
  const { data: row, error } = await supabase
    .from("registrations")
    .insert({
      unique_id: uniqueId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      state: data.state,
      spouse_attending: data.spouseAttending,
      children: data.children,
      room_preference: data.roomPreference,
      room_preference_other: data.roomPreferenceOther,
      accessibility_needs: data.accessibilityNeeds,
      accessibility_details: data.accessibilityDetails,
      dietary: data.dietary,
      dietary_other: data.dietaryOther,
      willing_testimony: data.willingTestimony,
      willing_lead: data.willingLead,
      has_talent: data.hasTalent,
      talent_details: data.talentDetails,
      fee: data.fee,
      payment_method: data.paymentMethod,
      consent: data.consent ?? false,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toCamelCase(row as DbRow);
}

export async function getRegistrationById(id: string): Promise<Registration | null> {
  const { data, error } = await supabase
    .from("registrations")
    .select()
    .eq("unique_id", id)
    .single();

  if (error || !data) return null;
  return toCamelCase(data as DbRow);
}

export async function getAllRegistrations(): Promise<Registration[]> {
  const { data, error } = await supabase
    .from("registrations")
    .select()
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as DbRow[]).map(toCamelCase);
}

export async function markCheckedIn(id: string): Promise<Registration | null> {
  const { data, error } = await supabase
    .from("registrations")
    .update({ checked_in: true, checked_in_at: new Date().toISOString() })
    .eq("unique_id", id)
    .select()
    .single();

  if (error || !data) return null;
  return toCamelCase(data as DbRow);
}

export async function getRegistrationStats(): Promise<{
  total: number;
  checkedIn: number;
  pending: number;
  single: number;
  couple: number;
}> {
  const all = await getAllRegistrations();
  return {
    total: all.length,
    checkedIn: all.filter((r) => r.checkedIn).length,
    pending: all.filter((r) => !r.checkedIn).length,
    single: all.filter((r) => r.fee === "single").length,
    couple: all.filter((r) => r.fee === "couple").length,
  };
}

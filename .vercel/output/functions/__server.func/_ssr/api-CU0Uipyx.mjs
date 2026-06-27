import { _ as __toESM, i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as Resend } from "../_libs/resend+standardwebhooks.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-CU0Uipyx.js
var import_lib = /* @__PURE__ */ __toESM(require_lib());
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function getEnv(key) {
	if (typeof process !== "undefined" && process.env && process.env[key]) return process.env[key];
	if (typeof import.meta !== "undefined" && {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3cWF0eW1hYXBrdGpxeW5hcmR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NTYzMDAsImV4cCI6MjA5ODEzMjMwMH0._PV_cIPRn__YZKXqtNd5Z_mvz9gislVSiY6T6QWWgoI",
		"VITE_SUPABASE_URL": "https://iwqatymaapktjqynardv.supabase.co"
	}[key]) return {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3cWF0eW1hYXBrdGpxeW5hcmR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NTYzMDAsImV4cCI6MjA5ODEzMjMwMH0._PV_cIPRn__YZKXqtNd5Z_mvz9gislVSiY6T6QWWgoI",
		"VITE_SUPABASE_URL": "https://iwqatymaapktjqynardv.supabase.co"
	}[key];
	throw new Error(`Missing environment variable: ${key}`);
}
var supabase = createClient(getEnv("VITE_SUPABASE_URL"), getEnv("VITE_SUPABASE_ANON_KEY"));
function toCamelCase(row) {
	return {
		id: row.id,
		uniqueId: row.unique_id,
		name: row.name,
		email: row.email,
		phone: row.phone,
		state: row.state,
		spouseAttending: row.spouse_attending,
		children: row.children,
		roomPreference: row.room_preference,
		roomPreferenceOther: row.room_preference_other,
		accessibilityNeeds: row.accessibility_needs,
		accessibilityDetails: row.accessibility_details,
		dietary: row.dietary,
		dietaryOther: row.dietary_other,
		willingTestimony: row.willing_testimony,
		willingLead: row.willing_lead,
		hasTalent: row.has_talent,
		talentDetails: row.talent_details,
		fee: row.fee,
		paymentMethod: row.payment_method,
		consent: row.consent,
		checkedIn: row.checked_in,
		checkedInAt: row.checked_in_at,
		createdAt: row.created_at
	};
}
function generateId() {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "CMDA-";
	for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * 36));
	return result;
}
async function createRegistration(data) {
	const uniqueId = generateId();
	const { data: row, error } = await supabase.from("registrations").insert({
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
		consent: data.consent ?? false
	}).select().single();
	if (error) throw new Error(error.message);
	return toCamelCase(row);
}
async function getRegistrationById(id) {
	const { data, error } = await supabase.from("registrations").select().eq("unique_id", id).single();
	if (error || !data) return null;
	return toCamelCase(data);
}
async function getAllRegistrations() {
	const { data, error } = await supabase.from("registrations").select().order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data.map(toCamelCase);
}
async function markCheckedIn(id) {
	const { data, error } = await supabase.from("registrations").update({
		checked_in: true,
		checked_in_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("unique_id", id).select().single();
	if (error || !data) return null;
	return toCamelCase(data);
}
async function getRegistrationStats() {
	const all = await getAllRegistrations();
	return {
		total: all.length,
		checkedIn: all.filter((r) => r.checkedIn).length,
		pending: all.filter((r) => !r.checkedIn).length,
		single: all.filter((r) => r.fee === "single").length,
		couple: all.filter((r) => r.fee === "couple").length
	};
}
var FROM = "CMDA Retreat <noreply@in-person-retreat.cmdanigeria.org>";
function getApiKey() {
	if (typeof process !== "undefined" && process.env?.RESEND_API_KEY) return process.env.RESEND_API_KEY;
	throw new Error("Missing RESEND_API_KEY environment variable");
}
function buildEmailHtml({ name, uniqueId, email, phone, fee, qrDataUrl }) {
	return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f3ff;font-family:Inter,system-ui,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden">
      <tr><td style="background:linear-gradient(135deg,#2a0a5e,#1b6b3a);padding:32px;text-align:center">
        <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700">Registration Confirmed</h1>
        <p style="margin:8px 0 0;color:#d4d4ff;font-size:14px">CMDA Americas Retreat 2026</p>
      </td></tr>
      <tr><td style="padding:32px">
        <p style="margin:0 0 4px;font-size:16px">Dear <strong>${name}</strong>,</p>
        <p style="margin:0 0 24px;color:#6b7280;font-size:14px">
          Your registration for the <strong>2026 Annual In-Person Retreat</strong> is confirmed.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px;padding:16px;margin-bottom:24px">
          <tr><td style="padding:4px 0;font-size:13px;color:#6b7280">Unique ID</td>
              <td style="padding:4px 0;font-size:13px;font-weight:600;text-align:right;font-family:monospace">${uniqueId}</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#6b7280">Name</td>
              <td style="padding:4px 0;font-size:13px;font-weight:600;text-align:right">${name}</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#6b7280">Email</td>
              <td style="padding:4px 0;font-size:13px;font-weight:600;text-align:right">${email}</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#6b7280">Phone</td>
              <td style="padding:4px 0;font-size:13px;font-weight:600;text-align:right">${phone}</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#6b7280">Fee</td>
              <td style="padding:4px 0;font-size:13px;font-weight:600;text-align:right">$${fee}</td></tr>
        </table>

        <div style="text-align:center;margin-bottom:24px">
          <p style="margin:0 0 12px;font-size:13px;color:#6b7280"><strong>Your QR Code</strong> — present this at check-in</p>
          <img src="${qrDataUrl}" alt="QR Code" style="width:200px;height:200px;border-radius:8px" />
        </div>

        <p style="margin:0 0 8px;font-size:14px;color:#6b7280">
          <strong>Maritime Conference Center</strong><br/>
          Linthicum Heights, MD<br/>
          October 9 – 11, 2026
        </p>
        <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;text-align:center">
          CMDA Nigeria — Americas &amp; Caribbeans Region
        </p>
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;
}
async function sendConfirmationEmail(reg) {
	const fee = reg.fee === "single" ? "250" : "400";
	const qrDataUrl = await import_lib.toDataURL(JSON.stringify({
		id: reg.uniqueId,
		name: reg.name,
		email: reg.email
	}), {
		width: 400,
		margin: 2,
		color: { dark: "#1a0a3e" }
	});
	const { error } = await new Resend(getApiKey()).emails.send({
		from: FROM,
		to: reg.email,
		subject: `CMDA Retreat 2026 — Registration Confirmed (${reg.uniqueId})`,
		html: buildEmailHtml({
			name: reg.name,
			uniqueId: reg.uniqueId,
			email: reg.email,
			phone: reg.phone,
			fee,
			qrDataUrl
		})
	});
	if (error) console.error("Failed to send confirmation email:", error);
}
var submitRegistration_createServerFn_handler = createServerRpc({
	id: "245ea38c217cf20c91134eb32a98e5b6795fdeb094bc6b129a418acb9a85ca2d",
	name: "submitRegistration",
	filename: "src/lib/api.ts"
}, (opts) => submitRegistration.__executeServer(opts));
var submitRegistration = createServerFn({ method: "POST" }).validator((data) => data).handler(submitRegistration_createServerFn_handler, async ({ data }) => {
	const reg = await createRegistration(data);
	sendConfirmationEmail(reg).catch((err) => console.error("Confirmation email failed:", err));
	return reg;
});
var listRegistrations_createServerFn_handler = createServerRpc({
	id: "2fbb83f4b26f0382d20685bda4447392f67f514190ff27e6a12b5eebd7f5e551",
	name: "listRegistrations",
	filename: "src/lib/api.ts"
}, (opts) => listRegistrations.__executeServer(opts));
var listRegistrations = createServerFn({ method: "GET" }).handler(listRegistrations_createServerFn_handler, async () => {
	return getAllRegistrations();
});
var getRegistration_createServerFn_handler = createServerRpc({
	id: "c97c532805ac7e6c6b47286662565b8390f2ec62be788d13961b0e9b616445e4",
	name: "getRegistration",
	filename: "src/lib/api.ts"
}, (opts) => getRegistration.__executeServer(opts));
var getRegistration = createServerFn({ method: "GET" }).validator((id) => id).handler(getRegistration_createServerFn_handler, async ({ data: id }) => {
	return getRegistrationById(id) ?? null;
});
var checkInAttendee_createServerFn_handler = createServerRpc({
	id: "e0b49254a5388d3ac5974b764e4c4b31ce6cb75d7215142e620c5e17adcd3497",
	name: "checkInAttendee",
	filename: "src/lib/api.ts"
}, (opts) => checkInAttendee.__executeServer(opts));
var checkInAttendee = createServerFn({ method: "POST" }).validator((id) => id).handler(checkInAttendee_createServerFn_handler, async ({ data: id }) => {
	return markCheckedIn(id);
});
var getStats_createServerFn_handler = createServerRpc({
	id: "6b52bd689324a00657050155ca18337e65e2c9c00f9b71cb57a7d82915acd0e2",
	name: "getStats",
	filename: "src/lib/api.ts"
}, (opts) => getStats.__executeServer(opts));
var getStats = createServerFn({ method: "GET" }).handler(getStats_createServerFn_handler, async () => {
	return getRegistrationStats();
});
//#endregion
export { checkInAttendee_createServerFn_handler, getRegistration_createServerFn_handler, getStats_createServerFn_handler, listRegistrations_createServerFn_handler, submitRegistration_createServerFn_handler };

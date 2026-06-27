import { Resend } from "resend";
import QRCode from "qrcode";

const FROM = "CMDA Retreat <noreply@in-person-retreat.cmdanigeria.org>";
const CONFIRMATION_URL = "https://iwqatymaapktjqynardv.supabase.co";

function getApiKey(): string {
  if (typeof process !== "undefined" && process.env?.RESEND_API_KEY) {
    return process.env.RESEND_API_KEY;
  }
  throw new Error("Missing RESEND_API_KEY environment variable");
}

function buildEmailHtml({
  name,
  uniqueId,
  email,
  phone,
  fee,
  qrDataUrl,
}: {
  name: string;
  uniqueId: string;
  email: string;
  phone: string;
  fee: string;
  qrDataUrl: string;
}): string {
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

export async function sendConfirmationEmail(reg: {
  id: string;
  uniqueId: string;
  name: string;
  email: string;
  phone: string;
  fee: "single" | "couple";
}): Promise<void> {
  const fee = reg.fee === "single" ? "250" : "400";
  const qrDataUrl = await QRCode.toDataURL(
    JSON.stringify({ id: reg.uniqueId, name: reg.name, email: reg.email }),
    { width: 400, margin: 2, color: { dark: "#1a0a3e" } },
  );

  const resend = new Resend(getApiKey());

  const { error } = await resend.emails.send({
    from: FROM,
    to: reg.email,
    subject: `CMDA Retreat 2026 — Registration Confirmed (${reg.uniqueId})`,
    html: buildEmailHtml({
      name: reg.name,
      uniqueId: reg.uniqueId,
      email: reg.email,
      phone: reg.phone,
      fee,
      qrDataUrl,
    }),
  });

  if (error) {
    console.error("Failed to send confirmation email:", error);
  }
}

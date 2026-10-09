import { Resend } from "resend";
import QRCode from "qrcode";
import { QR_RENDER_OPTIONS, qrContent } from "./qr";

const FROM = "CMDA Retreat <noreply@in-person-retreat.cmdanigeria.org>";

export type QrEmailInput = {
  id: string;
  uniqueId: string;
  name: string;
  email: string;
  phone: string;
  fee: "single" | "couple";
  paymentStatus?: "pending" | "paid";
};

function getApiKey(): string {
  if (typeof process !== "undefined" && process.env?.RESEND_API_KEY) {
    return process.env.RESEND_API_KEY;
  }
  throw new Error("Missing RESEND_API_KEY environment variable");
}

async function buildQrBuffer(reg: QrEmailInput): Promise<string> {
  // Plain unique ID (see src/lib/qr.ts): a much smaller symbol that phone
  // cameras pick up reliably. The scanner still accepts older JSON codes.
  const qrBuffer = await QRCode.toBuffer(qrContent(reg.uniqueId), QR_RENDER_OPTIONS);
  return qrBuffer.toString("base64");
}

function buildAttachments(qrBase64: string) {
  return [
    { filename: "qrcode.png", content: qrBase64, contentId: "qrcode" },
    // Some mail clients block inline CID images, so ship the same PNG as a
    // regular attachment too.
    { filename: "cmda-checkin-qr.png", content: qrBase64 },
  ];
}

function buildEmailHtml({
  name,
  uniqueId,
  email,
  phone,
  fee,
  qrDataUrl,
  paymentStatus,
  heading = "Registration Confirmed",
  intro,
}: {
  name: string;
  uniqueId: string;
  email: string;
  phone: string;
  fee: string;
  qrDataUrl: string;
  paymentStatus?: "pending" | "paid";
  heading?: string;
  intro?: string;
}): string {
  const statusBadge =
    paymentStatus === "pending"
      ? `<span style="display:inline-block;background:#fef3c7;color:#92400e;font-size:12px;font-weight:600;padding:4px 10px;border-radius:9999px">Payment Pending</span>`
      : paymentStatus === "paid"
        ? `<span style="display:inline-block;background:#dcfce7;color:#166534;font-size:12px;font-weight:600;padding:4px 10px;border-radius:9999px">Paid</span>`
        : "";

  const introText =
    intro ??
    "Your registration for the <strong>2026 Annual In-Person Retreat</strong> is confirmed.";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f3ff;font-family:Inter,system-ui,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden">
      <tr><td style="background:linear-gradient(135deg,#2a0a5e,#1b6b3a);padding:32px;text-align:center">
        <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700">${heading}</h1>
        <p style="margin:8px 0 0;color:#d4d4ff;font-size:14px">CMDA Americas Retreat 2026</p>
      </td></tr>
      <tr><td style="padding:32px">
        <p style="margin:0 0 4px;font-size:16px">Dear <strong>${name}</strong>,</p>
        <p style="margin:0 0 16px;color:#6b7280;font-size:14px">${introText}</p>
        ${statusBadge ? `<p style="margin:0 0 20px">${statusBadge}</p>` : ""}

        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px;padding:16px;margin-bottom:24px">
          <tr><td style="padding:4px 0;font-size:13px;color:#6b7280">Unique ID</td>
              <td style="padding:4px 0;font-size:13px;font-weight:600;text-align:right;font-family:monospace">${uniqueId}</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#6b7280">Name</td>
              <td style="padding:4px 0;font-size:13px;font-weight:600;text-align:right">${name}</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#6b7280">Email</td>
              <td style="padding:4px 0;font-size:13px;font-weight:600;text-align:right">${email}</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#6b7280">Phone</td>
              <td style="padding:4px 0;font-size:13px;font-weight:600;text-align:right">${phone || "—"}</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#6b7280">Fee</td>
              <td style="padding:4px 0;font-size:13px;font-weight:600;text-align:right">$${fee}</td></tr>
        </table>

        <div style="text-align:center;margin-bottom:24px">
          <p style="margin:0 0 12px;font-size:13px;color:#6b7280"><strong>Your QR Code</strong> — present this at check-in</p>
          <img src="${qrDataUrl}" alt="Check-in QR code for ${uniqueId}" width="240" height="240" style="width:240px;height:240px;border-radius:8px;border:1px solid #e5e7eb;background:#ffffff" />
          <p style="margin:12px 0 0;font-size:13px;color:#6b7280;font-family:monospace">Code: ${uniqueId}</p>
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

export async function sendConfirmationEmail(reg: QrEmailInput): Promise<void> {
  const fee = reg.fee === "single" ? "250" : "400";
  const qrBase64 = await buildQrBuffer(reg);
  const resend = new Resend(getApiKey());

  const { error } = await resend.emails.send({
    from: FROM,
    to: reg.email,
    subject: `CMDA Retreat 2026 — Registration Confirmed (${reg.uniqueId})`,
    attachments: buildAttachments(qrBase64),
    html: buildEmailHtml({
      name: reg.name,
      uniqueId: reg.uniqueId,
      email: reg.email,
      phone: reg.phone,
      fee,
      paymentStatus: "paid",
      qrDataUrl: "cid:qrcode",
    }),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function sendQrEmail(reg: QrEmailInput): Promise<void> {
  const fee = reg.fee === "single" ? "250" : "400";
  const qrBase64 = await buildQrBuffer(reg);
  const resend = new Resend(getApiKey());

  const { error } = await resend.emails.send({
    from: FROM,
    to: reg.email,
    subject: `Your Check-In QR Code — CMDA Americas Retreat 2026 (${reg.uniqueId})`,
    attachments: buildAttachments(qrBase64),
    html: buildEmailHtml({
      name: reg.name,
      uniqueId: reg.uniqueId,
      email: reg.email,
      phone: reg.phone,
      fee,
      paymentStatus: reg.paymentStatus,
      heading: "Your Check-In QR Code",
      intro:
        "Here is your personal QR code for the <strong>2026 Annual In-Person Retreat</strong>. Please present it at the venue check-in desk (you can show it on your phone or print it).",
      qrDataUrl: "cid:qrcode",
    }),
  });

  if (error) {
    throw new Error(error.message);
  }
}

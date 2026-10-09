import QRCode, { type QRCodeRenderersOptions } from "qrcode";

// Shared QR settings so codes are identical whether they are emailed or shown
// on screen.
export const QR_RENDER_OPTIONS: QRCodeRenderersOptions = {
  width: 600,
  // Quiet zone must stay at least 4 modules — smaller values make many phone
  // cameras fail to lock on.
  margin: 4,
  // Higher error correction tolerates glare, blur and partial coverage when a
  // code is shown on a phone screen.
  errorCorrectionLevel: "Q",
  color: { dark: "#1a0a3e", light: "#ffffff" },
};

// Plain unique ID instead of a JSON payload: far fewer modules, so the code is
// bigger and easier to scan. The check-in scanner also accepts the older
// JSON codes that were already emailed.
export function qrContent(uniqueId: string): string {
  return uniqueId.trim().toUpperCase();
}

export function buildQrDataUrl(uniqueId: string): Promise<string> {
  return QRCode.toDataURL(qrContent(uniqueId), { ...QR_RENDER_OPTIONS, width: 480 });
}

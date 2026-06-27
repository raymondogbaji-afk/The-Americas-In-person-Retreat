import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { CheckCircle2, ArrowLeft, Download } from "lucide-react";
import { getRegistration } from "@/lib/api";
import type { Registration } from "@/lib/storage";

export const Route = createFileRoute("/confirmation/$id")({
  component: ConfirmationPage,
  loader: async ({ params }) => {
    const reg = await getRegistration({ data: params.id });
    return { reg };
  },
  head: () => ({
    meta: [{ title: "Registration Confirmed — CMDA Americas Retreat 2026" }],
  }),
});

function ConfirmationPage() {
  const { reg } = Route.useLoaderData();
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    if (reg) {
      QRCode.toDataURL(JSON.stringify({ id: reg.uniqueId, name: reg.name, email: reg.email }), {
        width: 300,
        margin: 2,
        color: { dark: "#1a0a3e" },
      }).then(setQrDataUrl);
    }
  }, [reg]);

  if (!reg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-display font-bold mb-2">Registration not found</h1>
          <p className="text-muted-foreground mb-6">No registration matches that ID.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-primary text-primary-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> Back to registration
          </Link>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `cmda-${reg.uniqueId}-qrcode.png`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Link
            to="/"
            className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center text-white font-display font-bold shrink-0"
          >
            C
          </Link>
          <div>
            <p className="text-sm font-display font-bold leading-tight">
              CMDA Americas Retreat 2026
            </p>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Registration Confirmation
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-6">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>

          <h1 className="text-3xl font-display font-bold mb-2">Registration Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you, <span className="font-semibold text-foreground">{reg.name}</span>. Your
            registration for the CMDA Americas Retreat 2026 has been received.
          </p>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-8 text-left">
            <h2 className="font-display font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
              Registration Details
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Unique ID</dt>
                <dd className="font-mono font-bold text-primary">{reg.uniqueId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium">{reg.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Email</dt>
                <dd>{reg.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Phone</dt>
                <dd>{reg.phone}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Fee</dt>
                <dd className="font-medium">${reg.fee === "single" ? "250" : "400"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/10 text-success px-3 py-0.5 text-xs font-semibold">
                    Registered
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {qrDataUrl && (
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-8">
              <h2 className="font-display font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
                Your QR Code — Present at Check-In
              </h2>
              <div className="flex justify-center mb-4">
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="rounded-lg"
                  width={240}
                  height={240}
                />
              </div>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-input bg-background hover:bg-muted text-sm font-medium"
              >
                <Download className="w-4 h-4" /> Download QR Code
              </button>
            </div>
          )}

          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-border rounded-2xl p-6 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Confirmation Email</p>
            <p>
              A confirmation email with your unique ID and QR code has been sent to{" "}
              <span className="font-semibold text-foreground">{reg.email}</span>.
            </p>
            <p className="mt-2">
              Please save your QR code — you will need it for check-in at the venue.
            </p>
          </div>

          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

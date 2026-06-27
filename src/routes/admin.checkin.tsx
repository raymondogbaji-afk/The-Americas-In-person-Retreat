import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Camera,
  CameraOff,
  UserCheck,
  Loader2,
} from "lucide-react";
import { checkInAttendee, getRegistration } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/checkin")({
  component: CheckInPage,
  head: () => ({
    meta: [{ title: "Check-In — CMDA Americas Retreat" }],
  }),
});

function CheckInPage() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ id: string; name: string; email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkedInReg, setCheckedInReg] = useState<{
    name: string;
    uniqueId: string;
    alreadyCheckedIn: boolean;
  } | null>(null);
  const [manualId, setManualId] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerDivRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const checkInMutation = useMutation({
    mutationFn: (id: string) => checkInAttendee({ data: id }),
    onSuccess: (reg) => {
      if (reg) {
        setCheckedInReg({ name: reg.name, uniqueId: reg.uniqueId, alreadyCheckedIn: false });
        setResult(null);
        queryClient.invalidateQueries({ queryKey: ["registrations"] });
        queryClient.invalidateQueries({ queryKey: ["registration-stats"] });
      }
    },
    onError: () => {
      setError("Failed to check in. Please try again.");
    },
  });

  const startScanner = async () => {
    setError(null);
    setResult(null);
    setCheckedInReg(null);

    // Show the scanner div first so Html5Qrcode can render into it
    setScanning(true);

    // Wait for React to render the div
    await new Promise((r) => setTimeout(r, 100));

    try {
      const scanner = new Html5Qrcode("qr-scanner");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          try {
            const data = JSON.parse(decodedText);
            if (data.id) {
              scanner.pause();
              setResult(data);
            } else {
              setError("Invalid QR code format.");
            }
          } catch {
            setError("Could not read QR code. Try again.");
          }
        },
        () => {},
      );
    } catch (err) {
      setScanning(false);
      setError("Camera access denied or not available. Use manual entry instead.");
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {
        /* scanner may already be stopped */
      }
      scannerRef.current = null;
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop();
          scannerRef.current.clear();
        } catch {
          /* scanner may already be stopped */
        }
      }
    };
  }, []);

  const handleCheckIn = async (id: string) => {
    setError(null);
    setCheckedInReg(null);
    checkInMutation.mutate(id);
  };

  const handleManualLookup = async () => {
    if (!manualId.trim()) return;
    setError(null);
    setResult(null);
    setCheckedInReg(null);

    const reg = await getRegistration({ data: manualId.trim().toUpperCase() });
    if (reg) {
      setResult({ id: reg.uniqueId, name: reg.name, email: reg.email });
    } else {
      setError("No registration found with that ID.");
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setCheckedInReg(null);
    setManualId("");
    if (scannerRef.current) {
      scannerRef.current.resume();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-card/85 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center text-white font-display font-bold shrink-0"
            >
              C
            </Link>
            <div>
              <p className="text-sm font-display font-bold leading-tight">Venue Check-In</p>
              <p className="text-[11px] text-muted-foreground leading-tight">
                CMDA Americas Retreat 2026
              </p>
            </div>
          </div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-input text-sm hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-display font-bold mb-1">Attendee Check-In</h1>
            <p className="text-muted-foreground text-sm">
              Scan the attendee&apos;s QR code or enter their unique ID manually.
            </p>
          </div>

          {checkedInReg ? (
            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-xl font-display font-bold text-success mb-1">Checked In!</h2>
              <p className="text-lg font-semibold">{checkedInReg.name}</p>
              <p className="text-sm text-muted-foreground font-mono mt-1">
                {checkedInReg.uniqueId}
              </p>
              <Button onClick={reset} className="mt-6">
                Check In Next Attendee
              </Button>
            </div>
          ) : result ? (
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="font-display font-semibold mb-4">Attendee Found</h2>
              <dl className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">ID</dt>
                  <dd className="font-mono font-bold text-primary">{result.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Name</dt>
                  <dd className="font-medium">{result.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>{result.email}</dd>
                </div>
              </dl>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleCheckIn(result.id)}
                  disabled={checkInMutation.isPending}
                  className="flex-1"
                >
                  {checkInMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserCheck className="w-4 h-4" />
                  )}
                  Confirm Check-In
                </Button>
                <Button variant="outline" onClick={reset}>
                  Cancel
                </Button>
              </div>
              {error && (
                <p className="mt-3 text-sm text-destructive flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> {error}
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-semibold">QR Code Scanner</h2>
                  {scanning ? (
                    <Badge variant="default" className="bg-success/10 text-success">
                      <Camera className="w-3 h-3 mr-1" /> Active
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <CameraOff className="w-3 h-3 mr-1" /> Inactive
                    </Badge>
                  )}
                </div>

                <div
                  id="qr-scanner"
                  ref={scannerDivRef}
                  className={`w-full aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center ${scanning ? "" : "hidden"}`}
                />

                {!scanning ? (
                  <div className="text-center py-12">
                    <Camera className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm mb-4">
                      Click below to start the camera and scan attendee QR codes.
                    </p>
                    <Button onClick={startScanner}>
                      <Camera className="w-4 h-4" /> Start Camera Scanner
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                      Point the camera at the attendee&apos;s QR code.
                    </p>
                    <Button variant="outline" onClick={stopScanner}>
                      <CameraOff className="w-4 h-4" /> Stop Scanner
                    </Button>
                  </div>
                )}
                {error && (
                  <p className="mt-3 text-sm text-destructive flex items-center justify-center gap-1">
                    <XCircle className="w-4 h-4" /> {error}
                  </p>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or enter manually
                  </span>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h2 className="font-display font-semibold mb-4">Manual Entry</h2>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value.toUpperCase())}
                    placeholder="Enter unique ID (e.g. CMDA-XXXXXXXX)"
                    className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-mono"
                    onKeyDown={(e) => e.key === "Enter" && handleManualLookup()}
                  />
                  <Button onClick={handleManualLookup}>
                    <UserCheck className="w-4 h-4" /> Look Up
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

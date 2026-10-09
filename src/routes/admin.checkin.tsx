import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, type CameraDevice, type Html5QrcodeCameraScanConfig } from "html5-qrcode";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Camera,
  CameraOff,
  UserCheck,
  Loader2,
  Download,
} from "lucide-react";
import { checkInAttendee, getRegistration, listRegistrations } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/checkin")({
  component: CheckInPage,
  head: () => ({
    meta: [{ title: "Check-In — CMDA Americas Retreat" }],
  }),
});

const SCAN_PROCESSING_MS = 3500;
const CMDA_ID_PATTERN = /^CMDA-[A-Z0-9]{4,16}$/i;

type CameraAttempt = {
  camera: string | MediaTrackConstraints;
  videoConstraints?: MediaTrackConstraints;
};

// The scan box must scale with the viewfinder. A fixed size (e.g. 250x250)
// exceeds the video area on small screens, which silently stops detection.
function qrBoxSize(viewfinderWidth: number, viewfinderHeight: number) {
  const side = Math.max(50, Math.floor(Math.min(viewfinderWidth, viewfinderHeight) * 0.72));
  return { width: side, height: side };
}

// html5-qrcode measures the container when the camera starts. If it is still
// hidden/unsized the scan canvas is created at 0x0 and nothing is ever decoded.
function waitForElementSize(element: HTMLElement | null, timeoutMs = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    const startedAt = performance.now();
    const tick = () => {
      if (element && element.isConnected && element.clientWidth > 0 && element.clientHeight > 0) {
        resolve(true);
        return;
      }
      if (performance.now() - startedAt >= timeoutMs) {
        resolve(false);
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
}

function cameraRank(device: CameraDevice): number {
  const label = (device.label || "").toLowerCase();
  if (/back|rear|environment|world/.test(label)) return 2;
  if (/front|user|face/.test(label)) return 0;
  return 1;
}

async function buildCameraAttempts(): Promise<CameraAttempt[]> {
  const attempts: CameraAttempt[] = [
    {
      camera: { facingMode: "environment" },
      videoConstraints: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    },
    { camera: { facingMode: "environment" } },
  ];

  try {
    const cameras = await Html5Qrcode.getCameras();
    const ordered = [...cameras].sort((a, b) => cameraRank(b) - cameraRank(a));
    for (const device of ordered) {
      if (device.id) attempts.push({ camera: device.id });
    }
  } catch {
    /* enumeration unavailable — the facingMode attempts still cover it */
  }

  attempts.push({ camera: { facingMode: "user" } });
  return attempts;
}

function describeCameraError(error: unknown): string {
  if (typeof window !== "undefined" && window.isSecureContext === false) {
    return "The camera needs a secure (HTTPS) connection. Open this page over https:// and try again.";
  }
  const message = String(error ?? "").toLowerCase();
  if (
    message.includes("notallowed") ||
    message.includes("permission") ||
    message.includes("denied")
  ) {
    return "Camera permission was denied. Allow camera access for this site, then start the scanner again.";
  }
  if (message.includes("notfound") || message.includes("no camera") || message.includes("nosuch")) {
    return "No camera was found on this device. Use manual entry instead.";
  }
  if (
    message.includes("notreadable") ||
    message.includes("in use") ||
    message.includes("could not start") ||
    message.includes("abort")
  ) {
    return "The camera is busy or unavailable (another app may be using it). Close other apps and try again.";
  }
  if (message.includes("overconstrained")) {
    return "This camera doesn't support the requested settings. Try again or use manual entry.";
  }
  return "Could not start the camera. Use manual entry instead.";
}

// Accepts both formats: plain "CMDA-XXXXXXXX" codes and the older JSON codes.
function parseQrPayload(text: string): { id: string; name: string; email: string } | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (parsed && typeof parsed === "object") {
      const record = parsed as Record<string, unknown>;
      const id = String(record.id ?? record.uniqueId ?? "").trim();
      if (!id) return null;
      return {
        id,
        name: record.name ? String(record.name) : "",
        email: record.email ? String(record.email) : "",
      };
    }
  } catch {
    /* not JSON — fall through to plain ID handling */
  }

  if (CMDA_ID_PATTERN.test(trimmed)) {
    return { id: trimmed.toUpperCase(), name: "", email: "" };
  }

  return null;
}

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
  const [processing, setProcessing] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerDivRef = useRef<HTMLDivElement>(null);
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scanHandledRef = useRef(false);
  const queryClient = useQueryClient();

  const { data: registrations = [] } = useQuery({
    queryKey: ["registrations"],
    queryFn: () => listRegistrations(),
    refetchInterval: 15000,
  });

  const checkedIn = registrations
    .filter((r) => r.checkedIn)
    .sort((a, b) => {
      const at = a.checkedInAt ? new Date(a.checkedInAt).getTime() : 0;
      const bt = b.checkedInAt ? new Date(b.checkedInAt).getTime() : 0;
      return bt - at;
    });

  const checkInMutation = useMutation({
    mutationFn: (id: string) => checkInAttendee({ data: id }),
    onSuccess: (reg) => {
      setProcessing(false);
      if (reg) {
        setCheckedInReg({ name: reg.name, uniqueId: reg.uniqueId, alreadyCheckedIn: false });
        setResult(null);
        queryClient.invalidateQueries({ queryKey: ["registrations"] });
        queryClient.invalidateQueries({ queryKey: ["registration-stats"] });
      }
    },
    onError: () => {
      setProcessing(false);
      setError("Failed to check in. Please try again.");
    },
  });

  const resumeScanner = () => {
    scanHandledRef.current = false;
    try {
      scannerRef.current?.resume();
    } catch {
      /* scanner is not paused (e.g. it was never started) */
    }
  };

  const pauseScanner = () => {
    try {
      scannerRef.current?.pause();
    } catch {
      /* scanner is not scanning */
    }
  };

  const finishScanProcessing = async (startedAt: number) => {
    const remaining = SCAN_PROCESSING_MS - (Date.now() - startedAt);
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }
    setProcessing(false);
  };

  const handleScannedText = async (text: string) => {
    const startedAt = Date.now();
    setError(null);
    setProcessing(true);

    const payload = parseQrPayload(text);
    if (!payload) {
      await finishScanProcessing(startedAt);
      setError("That QR code is not a CMDA check-in code.");
      resumeScanner();
      return;
    }

    let id = payload.id;
    let name = payload.name;
    let email = payload.email;

    if (!name) {
      try {
        const reg = await getRegistration({ data: id });
        if (reg) {
          id = reg.uniqueId;
          name = reg.name;
          email = reg.email;
        }
      } catch {
        /* treated as not found below */
      }
    }

    await finishScanProcessing(startedAt);

    if (name) {
      setResult({ id, name, email });
    } else {
      setError(`No registration found with ID ${id}.`);
      resumeScanner();
    }
  };

  const startScanner = async () => {
    setError(null);
    setResult(null);
    setCheckedInReg(null);
    scanHandledRef.current = false;

    // Show the scanner div first so Html5Qrcode can render into it
    setScanning(true);

    // Wait until the container is actually laid out — starting the camera while
    // it is still hidden produces a 0x0 scan area that never decodes anything.
    const containerVisible = await waitForElementSize(scannerDivRef.current);
    if (!containerVisible) {
      setScanning(false);
      setError(
        "The scanner view did not appear. Rotate the screen or reload the page, then try again.",
      );
      return;
    }

    const attempts = await buildCameraAttempts();
    let lastError: unknown = null;

    for (const attempt of attempts) {
      let candidate: Html5Qrcode | null = null;
      try {
        candidate = new Html5Qrcode("qr-scanner");

        const config: Html5QrcodeCameraScanConfig = {
          fps: 15,
          qrbox: qrBoxSize,
          ...(attempt.videoConstraints ? { videoConstraints: attempt.videoConstraints } : {}),
        };

        await candidate.start(
          attempt.camera,
          config,
          (decodedText) => {
            const text = decodedText.trim();
            if (!text || scanHandledRef.current) return;
            scanHandledRef.current = true;
            pauseScanner();
            void handleScannedText(text);
          },
          () => {},
        );

        scannerRef.current = candidate;
        return;
      } catch (err) {
        lastError = err;
        try {
          candidate?.clear();
        } catch {
          /* nothing to clean up */
        }
      }
    }

    setScanning(false);
    setError(describeCameraError(lastError));
  };

  const stopScanner = async () => {
    if (scanTimerRef.current) {
      clearTimeout(scanTimerRef.current);
      scanTimerRef.current = null;
    }
    setProcessing(false);
    scanHandledRef.current = false;
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
      if (scanTimerRef.current) {
        clearTimeout(scanTimerRef.current);
        scanTimerRef.current = null;
      }
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
    if (scanTimerRef.current) {
      clearTimeout(scanTimerRef.current);
      scanTimerRef.current = null;
    }
    setProcessing(false);
    setResult(null);
    setError(null);
    setCheckedInReg(null);
    setManualId("");
    resumeScanner();
  };

  const exportAttendance = () => {
    const headers = [
      "Name",
      "Unique ID",
      "Email",
      "Phone",
      "Fee",
      "Payment Status",
      "Checked In At",
    ];
    const rows = checkedIn.map((r) => [
      r.name,
      r.uniqueId,
      r.email,
      r.phone,
      r.fee === "single" ? "Single ($250)" : "Couple ($400)",
      r.paymentStatus,
      r.checkedInAt || "",
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cmda-retreat-attendance-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

                <div className="relative">
                  <div
                    id="qr-scanner"
                    ref={scannerDivRef}
                    className={`w-full aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center ${scanning ? "" : "hidden"}`}
                  />
                  {processing && (
                    <div className="absolute inset-0 bg-background/85 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center">
                      <Loader2 className="w-10 h-10 animate-spin text-primary mb-3" />
                      <p className="text-sm font-medium">Checking in…</p>
                      <p className="text-xs text-muted-foreground mt-1">Please wait</p>
                    </div>
                  )}
                </div>

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
                ) : processing ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                    <p className="text-sm font-medium">Verifying attendee…</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Checking them in, please wait.
                    </p>
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

        <div className="max-w-4xl mx-auto mt-10">
          <div className="bg-card border border-border rounded-2xl shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-6 border-b border-border">
              <div>
                <h2 className="font-display font-semibold flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-success" /> Checked-In Attendees
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {checkedIn.length} checked in
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={exportAttendance}
                disabled={checkedIn.length === 0}
              >
                <Download className="w-4 h-4" /> Export CSV
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Checked In At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checkedIn.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        No attendees checked in yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    checkedIn.map((reg) => (
                      <TableRow key={reg.id}>
                        <TableCell className="font-medium">{reg.name}</TableCell>
                        <TableCell className="font-mono text-xs">{reg.uniqueId}</TableCell>
                        <TableCell className="text-muted-foreground">{reg.email || "—"}</TableCell>
                        <TableCell>
                          {reg.paymentStatus === "paid" ? (
                            <Badge
                              variant="default"
                              className="bg-success/10 text-success hover:bg-success/15"
                            >
                              Paid
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-warning border-warning/30">
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {reg.checkedInAt ? new Date(reg.checkedInAt).toLocaleString() : "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

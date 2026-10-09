import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
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
              setError(null);
              setProcessing(true);
              if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
              scanTimerRef.current = setTimeout(() => {
                scanTimerRef.current = null;
                setProcessing(false);
                setResult(data);
              }, 3500);
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
    if (scanTimerRef.current) {
      clearTimeout(scanTimerRef.current);
      scanTimerRef.current = null;
    }
    setProcessing(false);
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
    if (scannerRef.current) {
      scannerRef.current.resume();
    }
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

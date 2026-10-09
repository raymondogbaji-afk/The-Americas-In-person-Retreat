import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  ScanQrCode,
  Shield,
  Search,
  Download,
  ExternalLink,
  DollarSign,
  Loader2,
  Mail,
  Send,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Trash2,
  QrCode,
  Printer,
} from "lucide-react";
import {
  listRegistrations,
  getStats,
  markPaid,
  getQrEmailStatus,
  sendQrEmailBatch,
  resendQrEmail,
  deleteRegistration,
} from "@/lib/api";
import { buildQrDataUrl } from "@/lib/qr";
import type { Registration } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
  head: () => ({
    meta: [{ title: "Admin Dashboard — CMDA Americas Retreat" }],
  }),
});

function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [resendAll, setResendAll] = useState(false);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState<{ sent: number; failed: number; total: number } | null>(
    null,
  );
  const [emailResult, setEmailResult] = useState<{
    sent: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [qrPreview, setQrPreview] = useState<{ reg: Registration; dataUrl: string } | null>(null);
  const [qrLoadingId, setQrLoadingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: registrations = [], error: regError } = useQuery({
    queryKey: ["registrations"],
    queryFn: () => listRegistrations(),
    refetchInterval: 10000,
  });

  const { data: stats, error: statsError } = useQuery({
    queryKey: ["registration-stats"],
    queryFn: () => getStats(),
    refetchInterval: 10000,
  });

  const { data: qrStatus } = useQuery({
    queryKey: ["qr-email-status"],
    queryFn: () => getQrEmailStatus(),
    refetchInterval: 10000,
  });

  const queryError = regError || statsError;

  const markPaidMutation = useMutation({
    mutationFn: (id: string) => markPaid({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["registration-stats"] });
    },
  });

  const resendQrMutation = useMutation({
    mutationFn: (id: string) => resendQrEmail({ data: id }),
    onSuccess: (res) => {
      setEmailResult({ sent: 1, failed: 0, errors: [`Resent QR code to ${res.email}`] });
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["qr-email-status"] });
    },
    onError: (err) => {
      setEmailResult({
        sent: 0,
        failed: 1,
        errors: [err instanceof Error ? err.message : String(err)],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRegistration({ data: id }),
    onSuccess: () => {
      setDeleteError(null);
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["registration-stats"] });
      queryClient.invalidateQueries({ queryKey: ["qr-email-status"] });
    },
    onError: (err) => {
      setDeleteError(err instanceof Error ? err.message : String(err));
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Delete registration for ${name} (${id})? This cannot be undone.`)) {
      return;
    }
    deleteMutation.mutate(id);
  };

  const openQrPreview = async (reg: Registration) => {
    setQrLoadingId(reg.uniqueId);
    try {
      const dataUrl = await buildQrDataUrl(reg.uniqueId);
      setQrPreview({ reg, dataUrl });
    } catch {
      setDeleteError("Could not generate a QR code for this attendee.");
    } finally {
      setQrLoadingId(null);
    }
  };

  const printQrCode = () => {
    if (!qrPreview) return;
    const { reg, dataUrl } = qrPreview;
    const escape = (value: string) =>
      value.replace(
        /[&<>"']/g,
        (char) =>
          ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char,
      );
    const win = window.open("", "_blank", "width=460,height=640");
    if (!win) return;
    win.document.write(
      `<!doctype html><html><head><meta charset="utf-8"><title>${escape(reg.uniqueId)}</title>` +
        `<style>body{font-family:system-ui,-apple-system,sans-serif;text-align:center;padding:32px;color:#111}` +
        `.code{width:300px;height:300px}h1{font-size:20px;margin:0 0 4px}p{margin:0 0 20px;color:#555}` +
        `.id{font-family:monospace;font-size:18px;letter-spacing:2px}</style></head><body>` +
        `<h1>${escape(reg.name)}</h1><p class="id">${escape(reg.uniqueId)}</p>` +
        `<img class="code" src="${dataUrl}" alt="QR code ${escape(reg.uniqueId)}"/>` +
        `</body></html>`,
    );
    win.document.close();
    win.focus();
    win.print();
  };

  const sendAllQrEmails = async () => {
    const total = resendAll ? (qrStatus?.total ?? 0) : (qrStatus?.pending ?? 0);
    if (total === 0) return;
    if (
      resendAll &&
      !window.confirm(`Resend QR emails to ALL ${total} participants? This cannot be undone.`)
    ) {
      return;
    }

    const limit = 8;
    let offset = 0;
    let sentTotal = 0;
    let failedTotal = 0;
    const errors: string[] = [];

    setSending(true);
    setEmailResult(null);
    setProgress({ sent: 0, failed: 0, total });

    try {
      while (true) {
        const res = await sendQrEmailBatch({ data: { force: resendAll, limit, offset } });
        sentTotal += res.sent;
        failedTotal += res.failed.length;
        for (const f of res.failed) errors.push(`${f.email}: ${f.error}`);
        setProgress({ sent: sentTotal, failed: failedTotal, total });

        if (resendAll) {
          offset += limit;
          if (res.processed < limit) break;
        } else {
          if (res.remaining === 0 || res.sent === 0) break;
        }
      }
      setEmailResult({ sent: sentTotal, failed: failedTotal, errors });
    } catch (err) {
      setEmailResult({
        sent: sentTotal,
        failed: failedTotal + 1,
        errors: [...errors, err instanceof Error ? err.message : String(err)],
      });
    } finally {
      setSending(false);
      setProgress(null);
      queryClient.invalidateQueries({ queryKey: ["qr-email-status"] });
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    }
  };

  const paidCount = registrations.filter((r) => r.paymentStatus === "paid").length;

  const filtered = registrations.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.uniqueId.toLowerCase().includes(search.toLowerCase()),
  );

  const exportCsv = () => {
    const headers = [
      "Unique ID",
      "Name",
      "Email",
      "Phone",
      "Country",
      "State",
      "Spouse Attending",
      "Children",
      "Room Preference",
      "Accessibility Needs",
      "Dietary",
      "Fee",
      "Payment Method",
      "Payment Status",
      "PayPal Transaction ID",
      "Checked In",
      "Checked In At",
      "Created At",
    ];
    const rows = registrations.map((r) => [
      r.uniqueId,
      r.name,
      r.email,
      r.phone,
      r.country,
      r.state,
      r.spouseAttending,
      r.children,
      r.roomPreference === "other" ? r.roomPreferenceOther : r.roomPreference,
      r.accessibilityNeeds === "yes" ? r.accessibilityDetails || "Yes" : r.accessibilityNeeds,
      r.dietary === "other" ? r.dietaryOther : r.dietary,
      r.fee === "single" ? "Single ($250)" : "Couple ($400)",
      r.paymentMethod,
      r.paymentStatus,
      r.paypalTransactionId || "",
      r.checkedIn ? "Yes" : "No",
      r.checkedInAt || "",
      r.createdAt,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join(
      "\n",
    );
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cmda-retreat-registrations.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-card/85 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center text-white font-display font-bold shrink-0">
              C
            </div>
            <div>
              <p className="text-sm font-display font-bold leading-tight">Admin Dashboard</p>
              <p className="text-[11px] text-muted-foreground leading-tight">
                CMDA Americas Retreat 2026
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/checkin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90"
            >
              <ScanQrCode className="w-4 h-4" /> Check-In
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-input text-sm hover:bg-muted"
            >
              <ExternalLink className="w-4 h-4" /> Site
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {queryError && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            <p className="font-semibold mb-1">Failed to load data</p>
            <p className="text-xs opacity-80">{queryError.message}</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" /> Total Registrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-display font-bold">{stats?.total ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-success" /> Checked In
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-display font-bold text-success">
                {stats?.checkedIn ?? 0}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UserX className="w-4 h-4 text-destructive" /> Pending Check-In
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-display font-bold text-destructive">
                {stats?.pending ?? 0}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-success" /> Payments Received
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-display font-bold text-success">{paidCount}</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm">
          <div className="p-4 sm:p-6 border-b border-border space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-muted-foreground select-none">
                  <input
                    type="checkbox"
                    checked={resendAll}
                    onChange={(e) => setResendAll(e.target.checked)}
                    disabled={sending}
                    className="h-4 w-4 rounded border-input accent-primary"
                  />
                  Resend to everyone
                </label>
                <Button
                  size="sm"
                  onClick={sendAllQrEmails}
                  disabled={sending || (!resendAll && (qrStatus?.pending ?? 0) === 0)}
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {resendAll ? "Resend QR Emails" : `Send QR Emails (${qrStatus?.pending ?? 0})`}
                </Button>
                <Button variant="outline" size="sm" onClick={exportCsv}>
                  <Download className="w-4 h-4" /> Export CSV
                </Button>
              </div>
            </div>

            {progress && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                Sending QR emails… {progress.sent} sent
                {progress.failed > 0 ? `, ${progress.failed} failed` : ""} of {progress.total}
              </div>
            )}

            {emailResult && !sending && (
              <div
                className={`p-3 rounded-lg border text-sm ${
                  emailResult.failed > 0
                    ? "bg-destructive/10 border-destructive/20 text-destructive"
                    : "bg-success/10 border-success/20 text-success"
                }`}
              >
                <p className="flex items-center gap-2 font-semibold">
                  {emailResult.failed > 0 ? (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  )}
                  {emailResult.sent} email{emailResult.sent !== 1 ? "s" : ""} sent
                  {emailResult.failed > 0 ? `, ${emailResult.failed} failed` : ""}.
                </p>
                {emailResult.errors.length > 0 && (
                  <ul className="mt-1 ml-6 list-disc text-xs opacity-90 space-y-0.5">
                    {emailResult.errors.slice(0, 8).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                    {emailResult.errors.length > 8 && (
                      <li>…and {emailResult.errors.length - 8} more</li>
                    )}
                  </ul>
                )}
              </div>
            )}

            {deleteError && (
              <div className="p-3 rounded-lg border bg-destructive/10 border-destructive/20 text-destructive text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {deleteError}
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Check-In</TableHead>
                  <TableHead>QR Email</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">
                      {search ? "No registrations match your search." : "No registrations yet."}
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell className="font-mono text-xs font-medium">{reg.uniqueId}</TableCell>
                    <TableCell className="font-medium">{reg.name}</TableCell>
                    <TableCell className="text-muted-foreground">{reg.email}</TableCell>
                    <TableCell>${reg.fee === "single" ? "250" : "400"}</TableCell>
                    <TableCell className="capitalize">{reg.paymentMethod || "—"}</TableCell>
                    <TableCell>
                      {reg.paymentStatus === "paid" ? (
                        <Badge
                          variant="default"
                          className="bg-success/10 text-success hover:bg-success/15"
                        >
                          Paid
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-warning border-warning/30">
                            Pending
                          </Badge>
                          <button
                            type="button"
                            disabled={markPaidMutation.isPending}
                            onClick={() => markPaidMutation.mutate(reg.uniqueId)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50"
                          >
                            {markPaidMutation.isPending ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Mail className="w-3 h-3" />
                            )}
                            Mark Paid & Send
                          </button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {reg.checkedIn ? (
                        <Badge
                          variant="default"
                          className="bg-success/10 text-success hover:bg-success/15"
                        >
                          Checked In
                        </Badge>
                      ) : (
                        <Badge variant="outline">—</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {reg.emailSentAt ? (
                          <Badge
                            variant="default"
                            className="bg-success/10 text-success hover:bg-success/15"
                          >
                            Sent
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2"
                          disabled={
                            !reg.email ||
                            (resendQrMutation.isPending &&
                              resendQrMutation.variables === reg.uniqueId)
                          }
                          onClick={() => resendQrMutation.mutate(reg.uniqueId)}
                        >
                          {resendQrMutation.isPending &&
                          resendQrMutation.variables === reg.uniqueId ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <RefreshCw className="w-3 h-3" />
                          )}
                          {reg.emailSentAt ? "Resend" : "Send"}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          disabled={qrLoadingId === reg.uniqueId}
                          onClick={() => void openQrPreview(reg)}
                          title="Show / print QR code"
                        >
                          {qrLoadingId === reg.uniqueId ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <QrCode className="w-3.5 h-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                          disabled={
                            deleteMutation.isPending && deleteMutation.variables === reg.uniqueId
                          }
                          onClick={() => handleDelete(reg.uniqueId, reg.name)}
                          title="Delete registration"
                        >
                          {deleteMutation.isPending && deleteMutation.variables === reg.uniqueId ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="px-4 sm:px-6 py-3 border-t border-border text-xs text-muted-foreground">
            Showing {filtered.length} of {registrations.length} registration
            {registrations.length !== 1 ? "s" : ""}
          </div>
        </div>
      </main>

      <Dialog open={!!qrPreview} onOpenChange={(open) => !open && setQrPreview(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{qrPreview?.reg.name}</DialogTitle>
            <DialogDescription className="font-mono">{qrPreview?.reg.uniqueId}</DialogDescription>
          </DialogHeader>
          {qrPreview ? (
            <div className="flex flex-col items-center gap-4 pt-2">
              <img
                src={qrPreview.dataUrl}
                alt={`Check-in QR code for ${qrPreview.reg.uniqueId}`}
                className="w-64 h-64 rounded-lg border border-border bg-white p-2"
              />
              <p className="text-xs text-muted-foreground text-center">
                Show this at the check-in desk, or print it as a backup.
              </p>
              <Button onClick={printQrCode}>
                <Printer className="w-4 h-4" /> Print QR Code
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

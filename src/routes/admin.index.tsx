import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
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
} from "lucide-react";
import { listRegistrations, getStats } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const { data: registrations = [] } = useQuery({
    queryKey: ["registrations"],
    queryFn: () => listRegistrations(),
    refetchInterval: 10000,
  });

  const { data: stats } = useQuery({
    queryKey: ["registration-stats"],
    queryFn: () => getStats(),
    refetchInterval: 10000,
  });

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
      "State",
      "Spouse Attending",
      "Children",
      "Room Preference",
      "Accessibility Needs",
      "Dietary",
      "Fee",
      "Payment Method",
      "Checked In",
      "Checked In At",
      "Created At",
    ];
    const rows = registrations.map((r) => [
      r.uniqueId,
      r.name,
      r.email,
      r.phone,
      r.state,
      r.spouseAttending,
      r.children,
      r.roomPreference === "other" ? r.roomPreferenceOther : r.roomPreference,
      r.accessibilityNeeds === "yes" ? r.accessibilityDetails || "Yes" : r.accessibilityNeeds,
      r.dietary === "other" ? r.dietaryOther : r.dietary,
      r.fee === "single" ? "Single ($250)" : "Couple ($400)",
      r.paymentMethod,
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
                <Shield className="w-4 h-4" /> Check-In Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-display font-bold">
                {stats && stats.total > 0
                  ? `${Math.round((stats.checkedIn / stats.total) * 100)}%`
                  : "—"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm">
          <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="w-4 h-4" /> Export CSV
            </Button>
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
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
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
                      {reg.checkedIn ? (
                        <Badge
                          variant="default"
                          className="bg-success/10 text-success hover:bg-success/15"
                        >
                          Checked In
                        </Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(reg.createdAt).toLocaleDateString()}
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
    </div>
  );
}

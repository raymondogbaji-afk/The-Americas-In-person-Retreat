import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { submitRegistration } from "@/lib/api";
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  ArrowRight,
  CreditCard,
  ExternalLink,
} from "lucide-react";
import heroImg from "@/assets/New Hero image.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CMDA Americas Retreat 2026 — Registration" },
      {
        name: "description",
        content:
          "Register for the 2026 Annual In-Person Retreat at Maritime Conference Center, MD. October 9–11, 2026.",
      },
    ],
  }),
  component: Index,
});

type Fee = "single" | "couple";

const fees: { id: Fee; label: string; price: number; note: string }[] = [
  { id: "single", label: "Single member", price: 250, note: "Individual registration" },
  {
    id: "couple",
    label: "Couple — both Physicians",
    price: 400,
    note: "Two registered physicians",
  },
];

const CREDIT_CARD_LINK = "#"; // replace with CMDA Global payment link
const HOTEL_BOOKING_LINK = "#"; // replace with Maritime Conf. Center booking link

type FormState = {
  // Step 1 — Attendee
  name: string;
  email: string;
  phone: string;
  state: string;
  spouseAttending: "" | "yes" | "no";
  children: string;

  // Step 2 — Accommodations
  roomPreference: "" | "single" | "double" | "other";
  roomPreferenceOther: string;
  accessibilityNeeds: "" | "yes" | "no";
  accessibilityDetails: string;
  dietary: "" | "none" | "vegetarian" | "gluten-free" | "other";
  dietaryOther: string;

  // Step 3 — Sessions & Activities
  willingTestimony: "" | "yes" | "no";
  willingLead: "" | "yes" | "no";
  hasTalent: "" | "yes" | "no";
  talentDetails: string;

  // Step 4 — Payment
  fee: Fee;
  paymentMethod: "" | "check" | "transfer" | "card";

  consent: boolean;
};

function Index() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    state: "",
    spouseAttending: "",
    children: "",
    roomPreference: "",
    roomPreferenceOther: "",
    accessibilityNeeds: "",
    accessibilityDetails: "",
    dietary: "",
    dietaryOther: "",
    willingTestimony: "",
    willingLead: "",
    hasTalent: "",
    talentDetails: "",
    fee: "single",
    paymentMethod: "",
    consent: false,
  });

  const selected = useMemo(() => fees.find((f) => f.id === form.fee)!, [form.fee]);

  const submitMutation = useMutation({
    mutationFn: () =>
      submitRegistration({
        data: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          state: form.state,
          spouseAttending: form.spouseAttending,
          children: form.children,
          roomPreference: form.roomPreference,
          roomPreferenceOther: form.roomPreferenceOther,
          accessibilityNeeds: form.accessibilityNeeds,
          accessibilityDetails: form.accessibilityDetails,
          dietary: form.dietary,
          dietaryOther: form.dietaryOther,
          willingTestimony: form.willingTestimony,
          willingLead: form.willingLead,
          hasTalent: form.hasTalent,
          talentDetails: form.talentDetails,
          fee: form.fee,
          paymentMethod: form.paymentMethod,
          consent: form.consent,
        },
      }),
    onSuccess: (reg) => {
      navigate({ to: "/confirmation/$id", params: { id: reg.uniqueId } });
    },
  });

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative text-primary-foreground overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImg}
              alt="CMDA Americas retreat attendees"
              className="w-full h-full object-cover"
              width={1920}
              height={1280}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-secondary/85 to-[oklch(0.22_0.08_295)]/95" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/30 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-accent mb-4">
                CMDA Nigeria · Americas &amp; Caribbeans Region
              </p>
              <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-5">
                2026 Annual <span className="gradient-text">In-Person Retreat</span>
              </h1>
              <p className="text-base md:text-lg font-display font-semibold tracking-wider uppercase mb-1 text-accent/70">
                Theme
              </p>
              <p className="text-xl md:text-2xl lg:text-3xl font-display font-bold tracking-wide uppercase text-accent">
                Ambassadors
              </p>
              <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto mb-10">
                Excelling in <em className="not-italic font-semibold text-white">Faith</em>,{" "}
                <em className="not-italic font-semibold text-white">Family</em>,{" "}
                <em className="not-italic font-semibold text-white">Field</em>, and{" "}
                <em className="not-italic font-semibold text-white">Finance</em>. Three days of
                worship, fellowship, and renewal with Christian physicians and dentists across the
                Americas and Caribbean.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-sm md:text-base">
                <Pill icon={<Calendar className="w-5 h-5 text-accent" />}>
                  October 9 – 11, 2026
                </Pill>
                <Pill icon={<MapPin className="w-5 h-5 text-accent" />}>
                  Maritime Conference Center, MD
                </Pill>
                <Pill icon={<Users className="w-5 h-5 text-accent" />}>In-Person Retreat</Pill>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#registration"
                  className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-6 py-3 font-semibold hover:brightness-105 transition"
                >
                  Register now <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#registration"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur px-6 py-3 font-semibold text-white hover:bg-white/15 transition"
                >
                  <CreditCard className="w-4 h-4" /> Complete payment
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* DASHBOARD */}
        <section id="registration" className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
                Registration Dashboard
              </h2>
              <p className="text-muted-foreground">Complete the steps below to secure your seat.</p>
            </div>

            <Stepper step={step} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                {step === 1 && <StepAttendee form={form} update={update} />}
                {step === 2 && <StepAccommodations form={form} update={update} />}
                {step === 3 && <StepSessions form={form} update={update} />}
                {step === 4 && <StepPayment form={form} update={update} selected={selected} />}
                {step === 5 && <StepReview form={form} selected={selected} />}

                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  <button
                    type="button"
                    disabled={step === 1}
                    onClick={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4 | 5) : s))}
                    className="px-5 py-2 rounded-md border border-input bg-background hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
                  >
                    Previous
                  </button>
                  {step < 5 ? (
                    <button
                      type="button"
                      onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3 | 4 | 5)}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90"
                    >
                      Next <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={submitMutation.isPending}
                      onClick={() => submitMutation.mutate()}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-accent text-accent-foreground font-semibold hover:brightness-105 disabled:opacity-60"
                    >
                      {submitMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                        </>
                      ) : (
                        <>Confirm &amp; Register ${selected.price}</>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <aside className="space-y-6">
                <SummaryCard form={form} selected={selected} />
                <HotelCard />
                <InfoCard />
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center text-white font-display font-bold shrink-0">
            C
          </div>
          <div className="min-w-0">
            <p className="text-sm font-display font-bold leading-tight truncate">
              CMDA Nigeria — Global Network
            </p>
            <p className="text-[11px] text-muted-foreground leading-tight truncate">
              Americas &amp; Caribbeans Region
            </p>
          </div>
        </div>
        <a
          href="#registration"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90"
        >
          Register
        </a>
      </div>
    </header>
  );
}

function Pill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-2 rounded-full">
      {icon}
      <span>{children}</span>
    </div>
  );
}

function Stepper({ step }: { step: 1 | 2 | 3 | 4 | 5 }) {
  const labels = ["Attendee", "Lodging", "Sessions", "Payment", "Review"];
  return (
    <ol className="flex flex-wrap gap-x-4 gap-y-3 justify-center max-w-3xl mx-auto">
      {labels.map((l, i) => {
        const n = (i + 1) as 1 | 2 | 3 | 4 | 5;
        const active = n === step;
        const done = n < step;
        return (
          <li key={l} className="flex items-center gap-2">
            <span
              className={`w-8 h-8 rounded-full grid place-items-center font-semibold text-sm shrink-0 ${
                done
                  ? "bg-secondary text-secondary-foreground"
                  : active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {done ? <CheckCircle2 className="w-4 h-4" /> : n}
            </span>
            <span
              className={`text-sm font-medium ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {l}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function YesNo({
  name,
  value,
  onChange,
}: {
  name: string;
  value: "" | "yes" | "no";
  onChange: (v: "yes" | "no") => void;
}) {
  return (
    <div className="flex gap-2">
      {(["yes", "no"] as const).map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={active}
            className={`px-4 py-2 rounded-md border text-sm font-medium capitalize transition ${
              active
                ? "border-primary bg-primary/10 text-primary"
                : "border-input bg-background hover:bg-muted"
            }`}
          >
            {opt}
          </button>
        );
      })}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}

type StepProps = {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
};

function StepAttendee({ form, update }: StepProps) {
  return (
    <div>
      <h3 className="text-xl font-display font-semibold mb-1">Attendee details</h3>
      <p className="text-sm text-muted-foreground mb-6">
        We will send your confirmation and payment receipt to this email.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Name *">
          <input
            className={inputCls}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </Field>
        <Field label="Email *">
          <input
            type="email"
            className={inputCls}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </Field>
        <Field label="Mobile Phone Number *">
          <input
            className={inputCls}
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </Field>
        <Field label="State of Residence (e.g. MD for Maryland)">
          <input
            className={inputCls}
            value={form.state}
            onChange={(e) => update("state", e.target.value)}
            placeholder="MD"
          />
        </Field>
        <Field label="Is your spouse attending?">
          <YesNo
            name="spouseAttending"
            value={form.spouseAttending}
            onChange={(v) => {
              update("spouseAttending", v);
              if (v === "no") update("children", "");
            }}
          />
        </Field>
        {form.spouseAttending === "yes" && (
          <Field label="Number of accompanying children (e.g. 1, 2 or 4)">
            <input
              type="number"
              min={0}
              className={inputCls}
              value={form.children}
              onChange={(e) => update("children", e.target.value)}
              placeholder="0"
            />
          </Field>
        )}
      </div>
    </div>
  );
}

function StepAccommodations({ form, update }: StepProps) {
  const roomOptions: { id: FormState["roomPreference"]; label: string }[] = [
    { id: "single", label: "Single Occupancy" },
    { id: "double", label: "Double Occupancy" },
    { id: "other", label: "Other" },
  ];
  const dietaryOptions: { id: FormState["dietary"]; label: string }[] = [
    { id: "none", label: "None" },
    { id: "vegetarian", label: "Vegetarian" },
    { id: "gluten-free", label: "Gluten-free" },
    { id: "other", label: "Other" },
  ];

  return (
    <div>
      <h3 className="text-xl font-display font-semibold mb-1">Accommodations &amp; lodging</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Share your room and dietary preferences so we can plan accordingly.
      </p>

      <div className="space-y-6">
        <Field label="Room preference">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {roomOptions.map((opt) => {
              const active = form.roomPreference === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => update("roomPreference", opt.id)}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input bg-background hover:bg-muted"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          {form.roomPreference === "other" && (
            <input
              className={`${inputCls} mt-2`}
              placeholder="Please specify"
              value={form.roomPreferenceOther}
              onChange={(e) => update("roomPreferenceOther", e.target.value)}
            />
          )}
        </Field>

        <Field label="Special accessibility needs">
          <YesNo
            name="accessibilityNeeds"
            value={form.accessibilityNeeds}
            onChange={(v) => {
              update("accessibilityNeeds", v);
              if (v === "no") update("accessibilityDetails", "");
            }}
          />
          {form.accessibilityNeeds === "yes" && (
            <input
              className={`${inputCls} mt-2`}
              placeholder="Please describe your needs"
              value={form.accessibilityDetails}
              onChange={(e) => update("accessibilityDetails", e.target.value)}
            />
          )}
        </Field>

        <Field label="Dietary restrictions *">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {dietaryOptions.map((opt) => {
              const active = form.dietary === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => update("dietary", opt.id)}
                  className={`px-3 py-2 rounded-md border text-sm font-medium transition ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input bg-background hover:bg-muted"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          {form.dietary === "other" && (
            <input
              className={`${inputCls} mt-2`}
              placeholder="Please specify"
              value={form.dietaryOther}
              onChange={(e) => update("dietaryOther", e.target.value)}
            />
          )}
        </Field>
      </div>
    </div>
  );
}

function StepSessions({ form, update }: StepProps) {
  return (
    <div>
      <h3 className="text-xl font-display font-semibold mb-1">Retreat sessions &amp; activities</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Let us know how you would like to participate.
      </p>

      <div className="space-y-6">
        <Field label="Would you be willing to share a brief personal testimony?">
          <YesNo
            name="willingTestimony"
            value={form.willingTestimony}
            onChange={(v) => update("willingTestimony", v)}
          />
        </Field>

        <Field label="Would you be willing to lead a breakout group or small session?">
          <YesNo
            name="willingLead"
            value={form.willingLead}
            onChange={(v) => update("willingLead", v)}
          />
        </Field>

        <Field label="Do you have any skills or talents you'd like to share during the retreat?">
          <YesNo
            name="hasTalent"
            value={form.hasTalent}
            onChange={(v) => {
              update("hasTalent", v);
              if (v === "no") update("talentDetails", "");
            }}
          />
          {form.hasTalent === "yes" && (
            <textarea
              className="w-full mt-2 rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[90px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Briefly describe your skill or talent — we may follow up for more information."
              value={form.talentDetails}
              onChange={(e) => update("talentDetails", e.target.value)}
            />
          )}
        </Field>
      </div>
    </div>
  );
}

function StepPayment({
  form,
  update,
  selected,
}: StepProps & { selected: { label: string; price: number } }) {
  const methodOptions: { id: FormState["paymentMethod"]; label: string; note: string }[] = [
    { id: "check", label: "Check", note: "Mail to CMDA Global" },
    { id: "transfer", label: "Bank Transfer", note: "Details sent on confirmation" },
    { id: "card", label: "Credit Card", note: "Pay online via CMDA Global" },
  ];

  return (
    <div>
      <h3 className="text-xl font-display font-semibold mb-1">Registration fee &amp; payment</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Registration fees are paid to <span className="font-medium">CMDA Global</span>.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fees.map((f) => {
          const active = form.fee === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => update("fee", f.id)}
              className={`text-left rounded-xl border p-4 transition ${
                active
                  ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-semibold">{f.label}</span>
                <span className="text-lg font-bold text-primary">${f.price}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{f.note}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <Field label="Payment method">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {methodOptions.map((m) => {
              const active = form.paymentMethod === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => update("paymentMethod", m.id)}
                  className={`text-left rounded-md border p-3 transition ${
                    active
                      ? "border-primary bg-primary/10"
                      : "border-input bg-background hover:bg-muted"
                  }`}
                >
                  <div className="text-sm font-semibold">{m.label}</div>
                  <div className="text-xs text-muted-foreground">{m.note}</div>
                </button>
              );
            })}
          </div>
        </Field>

        {form.paymentMethod === "card" && (
          <a
            href={CREDIT_CARD_LINK}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Pay ${selected.price} by credit card <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Hotel reservation</p>
        Hotel rooms are booked directly with Maritime Conference Center.{" "}
        <a
          href={HOTEL_BOOKING_LINK}
          target="_blank"
          rel="noreferrer"
          className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
        >
          Book your room <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

function StepReview({
  form,
  selected,
}: {
  form: FormState;
  selected: { label: string; price: number };
}) {
  const room =
    form.roomPreference === "other"
      ? form.roomPreferenceOther || "Other"
      : form.roomPreference
        ? form.roomPreference.charAt(0).toUpperCase() + form.roomPreference.slice(1) + " occupancy"
        : "—";
  const diet =
    form.dietary === "other"
      ? form.dietaryOther || "Other"
      : form.dietary
        ? form.dietary.charAt(0).toUpperCase() + form.dietary.slice(1)
        : "—";

  const rows: [string, string][] = [
    ["Name", form.name || "—"],
    ["Email", form.email || "—"],
    ["Mobile phone", form.phone || "—"],
    ["State of residence", form.state || "—"],
    ["Spouse attending", form.spouseAttending || "—"],
    ["Children", form.spouseAttending === "yes" ? form.children || "0" : "—"],
    ["Room preference", room],
    [
      "Accessibility needs",
      form.accessibilityNeeds === "yes"
        ? form.accessibilityDetails || "Yes"
        : form.accessibilityNeeds || "—",
    ],
    ["Dietary", diet],
    ["Willing to share testimony", form.willingTestimony || "—"],
    ["Willing to lead a session", form.willingLead || "—"],
    [
      "Skills / talents to share",
      form.hasTalent === "yes" ? form.talentDetails || "Yes" : form.hasTalent || "—",
    ],
    ["Registration fee", `${selected.label} — $${selected.price}`],
    ["Payment method", form.paymentMethod || "—"],
  ];

  return (
    <div>
      <h3 className="text-xl font-display font-semibold mb-1">Review your registration</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Confirm the details below and proceed to secure payment.
      </p>
      <dl className="divide-y divide-border rounded-lg border border-border">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-3 gap-3 px-4 py-3 text-sm">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="col-span-2 font-medium capitalize">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function SummaryCard({
  form,
  selected,
}: {
  form: FormState;
  selected: { label: string; price: number };
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <h4 className="font-display font-semibold mb-4">Your registration</h4>
      <div className="space-y-2 text-sm">
        <Row label="Event" value="Americas Retreat 2026" />
        <Row label="Dates" value="Oct 9 – 11, 2026" />
        <Row label="Venue" value="Maritime Conf. Center" />
        <Row label="Fee tier" value={selected.label} />
      </div>
      <div className="mt-5 pt-4 border-t border-border flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">Total due to CMDA Global</span>
        <span className="text-2xl font-display font-bold text-primary">${selected.price}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {form.email ? `Receipt to ${form.email}` : "Add your email in step 1."}
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

function HotelCard() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <h4 className="font-display font-semibold mb-2">Hotel reservation</h4>
      <p className="text-sm text-muted-foreground mb-3">
        Book your room directly at Maritime Conference Center.
      </p>
      <a
        href={HOTEL_BOOKING_LINK}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        Open booking link <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
}

function InfoCard() {
  return (
    <div className="bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-2xl p-6 shadow-sm">
      <h4 className="font-display font-semibold mb-2">Contact the LOC</h4>
      <p className="text-sm text-primary-foreground/85 mb-3">
        The Local Organizing Committee is here to help with any questions.
      </p>
      <p className="text-sm">
        <a href="tel:+14439307641" className="font-semibold underline underline-offset-4">
          (443) 930-7641
        </a>
      </p>
      <p className="text-sm mt-1">
        <a
          href="mailto:americascarribeans@cmdanigeria.org"
          className="font-semibold underline underline-offset-4 break-all"
        >
          americascarribeans@cmdanigeria.org
        </a>
      </p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
      <p className="italic">
        Caring for the whole man: spirit, soul and body — 1 Thessalonians 5:23
      </p>
      <p className="mt-2">
        © {new Date().getFullYear()} CMDA Nigeria Global Network — Americas &amp; Caribbeans
      </p>
    </footer>
  );
}

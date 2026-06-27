import { _ as __toESM } from "./esm-Dova13aH.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as submitRegistration } from "./api-BHruxrT0.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { c as ExternalLink, g as LoaderCircle, m as ArrowRight, p as Calendar, s as MapPin, t as Users, u as CreditCard, v as CircleCheck } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DxecRm_j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var retreat_hero_default = "/assets/retreat-hero-CridtJWW.jpg";
var fees = [{
	id: "single",
	label: "Single member",
	price: 250,
	note: "Individual registration"
}, {
	id: "couple",
	label: "Couple — both Physicians",
	price: 400,
	note: "Two registered physicians"
}];
var CREDIT_CARD_LINK = "#";
var HOTEL_BOOKING_LINK = "#";
function Index() {
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)(1);
	const [form, setForm] = (0, import_react.useState)({
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
		consent: false
	});
	const selected = (0, import_react.useMemo)(() => fees.find((f) => f.id === form.fee), [form.fee]);
	const submitMutation = useMutation({
		mutationFn: () => submitRegistration({ data: {
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
			consent: form.consent
		} }),
		onSuccess: (reg) => {
			navigate({
				to: "/confirmation/$id",
				params: { id: reg.uniqueId }
			});
		}
	});
	const update = (k, v) => setForm((f) => ({
		...f,
		[k]: v
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "relative text-primary-foreground overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: retreat_hero_default,
									alt: "CMDA Americas retreat attendees",
									className: "w-full h-full object-cover",
									width: 1920,
									height: 1280
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/95 via-secondary/85 to-[oklch(0.22_0.08_295)]/95" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-0 overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/30 rounded-full blur-3xl" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "container mx-auto px-4 py-20 md:py-32 relative z-10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "max-w-3xl mx-auto text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-accent mb-4",
										children: "CMDA Nigeria · Americas & Caribbeans Region"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
										className: "font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-5",
										children: ["2026 Annual ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "gradient-text",
											children: "In-Person Retreat"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-base md:text-lg font-display font-semibold tracking-wide uppercase mb-4 text-accent",
										children: "Ambassadors"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto mb-10",
										children: [
											"Excelling in ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
												className: "not-italic font-semibold text-white",
												children: "Faith"
											}),
											",",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
												className: "not-italic font-semibold text-white",
												children: "Family"
											}),
											",",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
												className: "not-italic font-semibold text-white",
												children: "Field"
											}),
											", and",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
												className: "not-italic font-semibold text-white",
												children: "Finance"
											}),
											". Three days of worship, fellowship, and renewal with Christian physicians and dentists across the Americas and Caribbean."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-sm md:text-base",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-5 h-5 text-accent" }),
												children: "October 9 – 11, 2026"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-5 h-5 text-accent" }),
												children: "Maritime Conference Center, MD"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-5 h-5 text-accent" }),
												children: "In-Person Retreat"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-10 flex flex-wrap items-center justify-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: "#registration",
											className: "inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-6 py-3 font-semibold hover:brightness-105 transition",
											children: ["Register now ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: "#registration",
											className: "inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur px-6 py-3 font-semibold text-white hover:bg-white/15 transition",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "w-4 h-4" }), " Complete payment"]
										})]
									})
								]
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "registration",
					className: "container mx-auto px-4 py-12 md:py-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-6xl mx-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center mb-10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-3xl md:text-4xl font-display font-bold mb-2",
									children: "Registration Dashboard"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: "Complete the steps below to secure your seat."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, { step }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "lg:col-span-2 bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm",
									children: [
										step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepAttendee, {
											form,
											update
										}),
										step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepAccommodations, {
											form,
											update
										}),
										step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepSessions, {
											form,
											update
										}),
										step === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepPayment, {
											form,
											update,
											selected
										}),
										step === 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepReview, {
											form,
											selected
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between mt-8 pt-6 border-t border-border",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: step === 1,
												onClick: () => setStep((s) => s > 1 ? s - 1 : s),
												className: "px-5 py-2 rounded-md border border-input bg-background hover:bg-muted disabled:opacity-40 disabled:pointer-events-none",
												children: "Previous"
											}), step < 5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setStep((s) => s + 1),
												className: "inline-flex items-center gap-2 px-5 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90",
												children: ["Next ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" })]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: submitMutation.isPending,
												onClick: () => submitMutation.mutate(),
												className: "inline-flex items-center gap-2 px-5 py-2 rounded-md bg-accent text-accent-foreground font-semibold hover:brightness-105 disabled:opacity-60",
												children: submitMutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), " Submitting..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Confirm & Register $", selected.price] })
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
									className: "space-y-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
											form,
											selected
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HotelCard, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {})
									]
								})]
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
function Header() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-30 bg-background/85 backdrop-blur border-b border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto px-4 h-16 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center text-white font-display font-bold shrink-0",
					children: "C"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-display font-bold leading-tight truncate",
						children: "CMDA Nigeria — Global Network"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground leading-tight truncate",
						children: "Americas & Caribbeans Region"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#registration",
				className: "hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90",
				children: "Register"
			})]
		})
	});
}
function Pill({ icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-2 rounded-full",
		children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children })]
	});
}
function Stepper({ step }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "flex flex-wrap gap-x-4 gap-y-3 justify-center max-w-3xl mx-auto",
		children: [
			"Attendee",
			"Lodging",
			"Sessions",
			"Payment",
			"Review"
		].map((l, i) => {
			const n = i + 1;
			const active = n === step;
			const done = n < step;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `w-8 h-8 rounded-full grid place-items-center font-semibold text-sm shrink-0 ${done ? "bg-secondary text-secondary-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`,
					children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4" }) : n
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `text-sm font-medium ${active ? "text-foreground" : "text-muted-foreground"}`,
					children: l
				})]
			}, l);
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-medium text-foreground mb-1.5 block",
			children: label
		}), children]
	});
}
var inputCls = "w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
function YesNo({ name, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-2",
		children: [["yes", "no"].map((opt) => {
			const active = value === opt;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onChange(opt),
				"aria-pressed": active,
				className: `px-4 py-2 rounded-md border text-sm font-medium capitalize transition ${active ? "border-primary bg-primary/10 text-primary" : "border-input bg-background hover:bg-muted"}`,
				children: opt
			}, opt);
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "hidden",
			name,
			value
		})]
	});
}
function StepAttendee({ form, update }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-xl font-display font-semibold mb-1",
			children: "Attendee details"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground mb-6",
			children: "We will send your confirmation and payment receipt to this email."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 md:grid-cols-2 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Name *",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputCls,
						value: form.name,
						onChange: (e) => update("name", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Email *",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "email",
						className: inputCls,
						value: form.email,
						onChange: (e) => update("email", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Mobile Phone Number *",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputCls,
						value: form.phone,
						onChange: (e) => update("phone", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "State of Residence (e.g. MD for Maryland)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputCls,
						value: form.state,
						onChange: (e) => update("state", e.target.value),
						placeholder: "MD"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Is your spouse attending?",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YesNo, {
						name: "spouseAttending",
						value: form.spouseAttending,
						onChange: (v) => {
							update("spouseAttending", v);
							if (v === "no") update("children", "");
						}
					})
				}),
				form.spouseAttending === "yes" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Number of accompanying children (e.g. 1, 2 or 4)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						min: 0,
						className: inputCls,
						value: form.children,
						onChange: (e) => update("children", e.target.value),
						placeholder: "0"
					})
				})
			]
		})
	] });
}
function StepAccommodations({ form, update }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-xl font-display font-semibold mb-1",
			children: "Accommodations & lodging"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground mb-6",
			children: "Share your room and dietary preferences so we can plan accordingly."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
					label: "Room preference",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-3 gap-2",
						children: [
							{
								id: "single",
								label: "Single Occupancy"
							},
							{
								id: "double",
								label: "Double Occupancy"
							},
							{
								id: "other",
								label: "Other"
							}
						].map((opt) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => update("roomPreference", opt.id),
								className: `px-4 py-2 rounded-md border text-sm font-medium transition ${form.roomPreference === opt.id ? "border-primary bg-primary/10 text-primary" : "border-input bg-background hover:bg-muted"}`,
								children: opt.label
							}, opt.id);
						})
					}), form.roomPreference === "other" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: `${inputCls} mt-2`,
						placeholder: "Please specify",
						value: form.roomPreferenceOther,
						onChange: (e) => update("roomPreferenceOther", e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
					label: "Special accessibility needs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YesNo, {
						name: "accessibilityNeeds",
						value: form.accessibilityNeeds,
						onChange: (v) => {
							update("accessibilityNeeds", v);
							if (v === "no") update("accessibilityDetails", "");
						}
					}), form.accessibilityNeeds === "yes" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: `${inputCls} mt-2`,
						placeholder: "Please describe your needs",
						value: form.accessibilityDetails,
						onChange: (e) => update("accessibilityDetails", e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
					label: "Dietary restrictions *",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
						children: [
							{
								id: "none",
								label: "None"
							},
							{
								id: "vegetarian",
								label: "Vegetarian"
							},
							{
								id: "gluten-free",
								label: "Gluten-free"
							},
							{
								id: "other",
								label: "Other"
							}
						].map((opt) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => update("dietary", opt.id),
								className: `px-3 py-2 rounded-md border text-sm font-medium transition ${form.dietary === opt.id ? "border-primary bg-primary/10 text-primary" : "border-input bg-background hover:bg-muted"}`,
								children: opt.label
							}, opt.id);
						})
					}), form.dietary === "other" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: `${inputCls} mt-2`,
						placeholder: "Please specify",
						value: form.dietaryOther,
						onChange: (e) => update("dietaryOther", e.target.value)
					})]
				})
			]
		})
	] });
}
function StepSessions({ form, update }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-xl font-display font-semibold mb-1",
			children: "Retreat sessions & activities"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground mb-6",
			children: "Let us know how you would like to participate."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Would you be willing to share a brief personal testimony?",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YesNo, {
						name: "willingTestimony",
						value: form.willingTestimony,
						onChange: (v) => update("willingTestimony", v)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Would you be willing to lead a breakout group or small session?",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YesNo, {
						name: "willingLead",
						value: form.willingLead,
						onChange: (v) => update("willingLead", v)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
					label: "Do you have any skills or talents you'd like to share during the retreat?",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YesNo, {
						name: "hasTalent",
						value: form.hasTalent,
						onChange: (v) => {
							update("hasTalent", v);
							if (v === "no") update("talentDetails", "");
						}
					}), form.hasTalent === "yes" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: "w-full mt-2 rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[90px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
						placeholder: "Briefly describe your skill or talent — we may follow up for more information.",
						value: form.talentDetails,
						onChange: (e) => update("talentDetails", e.target.value)
					})]
				})
			]
		})
	] });
}
function StepPayment({ form, update, selected }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-xl font-display font-semibold mb-1",
			children: "Registration fee & payment"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted-foreground mb-6",
			children: [
				"Registration fees are paid to ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: "CMDA Global"
				}),
				"."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
			children: fees.map((f) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => update("fee", f.id),
					className: `text-left rounded-xl border p-4 transition ${form.fee === f.id ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "border-border hover:border-primary/40"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display font-semibold",
							children: f.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-lg font-bold text-primary",
							children: ["$", f.price]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-1",
						children: f.note
					})]
				}, f.id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Payment method",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-2",
					children: [
						{
							id: "check",
							label: "Check",
							note: "Mail to CMDA Global"
						},
						{
							id: "transfer",
							label: "Bank Transfer",
							note: "Details sent on confirmation"
						},
						{
							id: "card",
							label: "Credit Card",
							note: "Pay online via CMDA Global"
						}
					].map((m) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => update("paymentMethod", m.id),
							className: `text-left rounded-md border p-3 transition ${form.paymentMethod === m.id ? "border-primary bg-primary/10" : "border-input bg-background hover:bg-muted"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold",
								children: m.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: m.note
							})]
						}, m.id);
					})
				})
			}), form.paymentMethod === "card" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: CREDIT_CARD_LINK,
				target: "_blank",
				rel: "noreferrer",
				className: "mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline",
				children: [
					"Pay $",
					selected.price,
					" by credit card ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-4 h-4" })
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium text-foreground mb-1",
					children: "Hotel reservation"
				}),
				"Hotel rooms are booked directly with Maritime Conference Center.",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: HOTEL_BOOKING_LINK,
					target: "_blank",
					rel: "noreferrer",
					className: "text-primary font-semibold hover:underline inline-flex items-center gap-1",
					children: ["Book your room ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3.5 h-3.5" })]
				})
			]
		})
	] });
}
function StepReview({ form, selected }) {
	const room = form.roomPreference === "other" ? form.roomPreferenceOther || "Other" : form.roomPreference ? form.roomPreference.charAt(0).toUpperCase() + form.roomPreference.slice(1) + " occupancy" : "—";
	const diet = form.dietary === "other" ? form.dietaryOther || "Other" : form.dietary ? form.dietary.charAt(0).toUpperCase() + form.dietary.slice(1) : "—";
	const rows = [
		["Name", form.name || "—"],
		["Email", form.email || "—"],
		["Mobile phone", form.phone || "—"],
		["State of residence", form.state || "—"],
		["Spouse attending", form.spouseAttending || "—"],
		["Children", form.spouseAttending === "yes" ? form.children || "0" : "—"],
		["Room preference", room],
		["Accessibility needs", form.accessibilityNeeds === "yes" ? form.accessibilityDetails || "Yes" : form.accessibilityNeeds || "—"],
		["Dietary", diet],
		["Willing to share testimony", form.willingTestimony || "—"],
		["Willing to lead a session", form.willingLead || "—"],
		["Skills / talents to share", form.hasTalent === "yes" ? form.talentDetails || "Yes" : form.hasTalent || "—"],
		["Registration fee", `${selected.label} — $${selected.price}`],
		["Payment method", form.paymentMethod || "—"]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-xl font-display font-semibold mb-1",
			children: "Review your registration"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground mb-6",
			children: "Confirm the details below and proceed to secure payment."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
			className: "divide-y divide-border rounded-lg border border-border",
			children: rows.map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-3 px-4 py-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-muted-foreground",
					children: k
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "col-span-2 font-medium capitalize",
					children: v
				})]
			}, k))
		})
	] });
}
function SummaryCard({ form, selected }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-card border border-border rounded-2xl p-6 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "font-display font-semibold mb-4",
				children: "Your registration"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Event",
						value: "Americas Retreat 2026"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Dates",
						value: "Oct 9 – 11, 2026"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Venue",
						value: "Maritime Conf. Center"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Fee tier",
						value: selected.label
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 pt-4 border-t border-border flex items-baseline justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-muted-foreground",
					children: "Total due to CMDA Global"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-2xl font-display font-bold text-primary",
					children: ["$", selected.price]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-2",
				children: form.email ? `Receipt to ${form.email}` : "Add your email in step 1."
			})
		]
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium text-right",
			children: value
		})]
	});
}
function HotelCard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-card border border-border rounded-2xl p-6 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "font-display font-semibold mb-2",
				children: "Hotel reservation"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mb-3",
				children: "Book your room directly at Maritime Conference Center."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: HOTEL_BOOKING_LINK,
				target: "_blank",
				rel: "noreferrer",
				className: "inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline",
				children: ["Open booking link ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-4 h-4" })]
			})
		]
	});
}
function InfoCard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-2xl p-6 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "font-display font-semibold mb-2",
				children: "Contact the LOC"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-primary-foreground/85 mb-3",
				children: "The Local Organizing Committee is here to help with any questions."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "tel:+14439307641",
					className: "font-semibold underline underline-offset-4",
					children: "(443) 930-7641"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm mt-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "mailto:americascarribeans@cmdanigeria.org",
					className: "font-semibold underline underline-offset-4 break-all",
					children: "americascarribeans@cmdanigeria.org"
				})
			})
		]
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-border py-8 text-center text-sm text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "italic",
			children: "Caring for the whole man: spirit, soul and body — 1 Thessalonians 5:23"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2",
			children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" CMDA Nigeria Global Network — Americas & Caribbeans"
			]
		})]
	});
}
//#endregion
export { Index as component };

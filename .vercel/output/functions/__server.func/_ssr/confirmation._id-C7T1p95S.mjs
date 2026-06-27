import { _ as __toESM } from "./esm-Dova13aH.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as ArrowLeft, l as Download, v as CircleCheck } from "../_libs/lucide-react.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
import { t as Route } from "./confirmation._id-CVHLgS-G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/confirmation._id-C7T1p95S.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
function ConfirmationPage() {
	const { reg } = Route.useLoaderData();
	const [qrDataUrl, setQrDataUrl] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (reg) import_lib.toDataURL(JSON.stringify({
			id: reg.uniqueId,
			name: reg.name,
			email: reg.email
		}), {
			width: 300,
			margin: 2,
			color: { dark: "#1a0a3e" }
		}).then(setQrDataUrl);
	}, [reg]);
	if (!reg) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-display font-bold mb-2",
					children: "Registration not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground mb-6",
					children: "No registration matches that ID."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "inline-flex items-center gap-2 px-5 py-2 rounded-md bg-primary text-primary-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4" }), " Back to registration"]
				})
			]
		})
	});
	const handleDownload = () => {
		if (!qrDataUrl) return;
		const a = document.createElement("a");
		a.href = qrDataUrl;
		a.download = `cmda-${reg.uniqueId}-qrcode.png`;
		a.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container mx-auto px-4 h-16 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center text-white font-display font-bold shrink-0",
					children: "C"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-display font-bold leading-tight",
					children: "CMDA Americas Retreat 2026"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-muted-foreground leading-tight",
					children: "Registration Confirmation"
				})] })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex-1 flex items-center justify-center px-4 py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-lg w-full text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-8 h-8 text-success" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-display font-bold mb-2",
						children: "Registration Confirmed!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted-foreground mb-8",
						children: [
							"Thank you, ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: reg.name
							}),
							". Your registration for the CMDA Americas Retreat 2026 has been received."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card border border-border rounded-2xl p-6 shadow-sm mb-8 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground",
							children: "Registration Details"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "space-y-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Unique ID"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-mono font-bold text-primary",
										children: reg.uniqueId
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-medium",
										children: reg.name
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: reg.email })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Phone"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: reg.phone })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Fee"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "font-medium",
										children: ["$", reg.fee === "single" ? "250" : "400"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex items-center gap-1 rounded-full bg-success/10 text-success px-3 py-0.5 text-xs font-semibold",
										children: "Registered"
									}) })]
								})
							]
						})]
					}),
					qrDataUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card border border-border rounded-2xl p-6 shadow-sm mb-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground",
								children: "Your QR Code — Present at Check-In"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-center mb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: qrDataUrl,
									alt: "QR Code",
									className: "rounded-lg",
									width: 240,
									height: 240
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleDownload,
								className: "inline-flex items-center gap-2 px-4 py-2 rounded-md border border-input bg-background hover:bg-muted text-sm font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }), " Download QR Code"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-gradient-to-br from-primary/5 to-secondary/5 border border-border rounded-2xl p-6 text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium text-foreground mb-1",
								children: "Confirmation Email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"A confirmation email with your unique ID and QR code has been sent to",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: reg.email
								}),
								"."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2",
								children: "Please save your QR code — you will need it for check-in at the venue."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "inline-flex items-center gap-2 px-5 py-2 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4" }), " Back to Home"]
						})
					})
				]
			})
		})]
	});
}
//#endregion
export { ConfirmationPage as component };

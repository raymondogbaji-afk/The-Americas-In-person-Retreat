import { _ as __toESM } from "./esm-Dova13aH.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as getRegistration, t as checkInAttendee } from "./api-BHruxrT0.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { n as Button, t as Badge } from "./button-BYtLCDFZ.mjs";
import { t as Html5Qrcode } from "../_libs/html5-qrcode.mjs";
import { _ as CircleX, d as Camera, f as CameraOff, g as LoaderCircle, h as ArrowLeft, r as UserCheck, v as CircleCheck } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.checkin-Ds7QOlc0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CheckInPage() {
	const [scanning, setScanning] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [checkedInReg, setCheckedInReg] = (0, import_react.useState)(null);
	const [manualId, setManualId] = (0, import_react.useState)("");
	const scannerRef = (0, import_react.useRef)(null);
	const scannerDivRef = (0, import_react.useRef)(null);
	const queryClient = useQueryClient();
	const checkInMutation = useMutation({
		mutationFn: (id) => checkInAttendee({ data: id }),
		onSuccess: (reg) => {
			if (reg) {
				setCheckedInReg({
					name: reg.name,
					uniqueId: reg.uniqueId,
					alreadyCheckedIn: false
				});
				setResult(null);
				queryClient.invalidateQueries({ queryKey: ["registrations"] });
				queryClient.invalidateQueries({ queryKey: ["registration-stats"] });
			}
		},
		onError: () => {
			setError("Failed to check in. Please try again.");
		}
	});
	const startScanner = async () => {
		setError(null);
		setResult(null);
		setCheckedInReg(null);
		if (!scannerDivRef.current) return;
		try {
			const scanner = new Html5Qrcode("qr-scanner");
			scannerRef.current = scanner;
			await scanner.start({ facingMode: "environment" }, {
				fps: 10,
				qrbox: {
					width: 250,
					height: 250
				}
			}, (decodedText) => {
				try {
					const data = JSON.parse(decodedText);
					if (data.id) {
						scanner.pause();
						setResult(data);
					} else setError("Invalid QR code format.");
				} catch {
					setError("Could not read QR code. Try again.");
				}
			}, () => {});
			setScanning(true);
		} catch (err) {
			setError("Camera access denied or not available. Use manual entry instead.");
		}
	};
	const stopScanner = async () => {
		if (scannerRef.current) {
			try {
				await scannerRef.current.stop();
				scannerRef.current.clear();
			} catch {}
			scannerRef.current = null;
		}
		setScanning(false);
	};
	(0, import_react.useEffect)(() => {
		return () => {
			if (scannerRef.current) try {
				scannerRef.current.stop();
				scannerRef.current.clear();
			} catch {}
		};
	}, []);
	const handleCheckIn = async (id) => {
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
		if (reg) setResult({
			id: reg.uniqueId,
			name: reg.name,
			email: reg.email
		});
		else setError("No registration found with that ID.");
	};
	const reset = () => {
		setResult(null);
		setError(null);
		setCheckedInReg(null);
		setManualId("");
		if (scannerRef.current) scannerRef.current.resume();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-30 bg-card/85 backdrop-blur border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container mx-auto px-4 h-16 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin",
						className: "w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center text-white font-display font-bold shrink-0",
						children: "C"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-display font-bold leading-tight",
						children: "Venue Check-In"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground leading-tight",
						children: "CMDA Americas Retreat 2026"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin",
					className: "inline-flex items-center gap-2 px-4 py-2 rounded-md border border-input text-sm hover:bg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4" }), " Dashboard"]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "container mx-auto px-4 py-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-2xl mx-auto space-y-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-display font-bold mb-1",
						children: "Attendee Check-In"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground text-sm",
						children: "Scan the attendee's QR code or enter their unique ID manually."
					})]
				}), checkedInReg ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border border-border rounded-2xl p-8 shadow-sm text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-8 h-8 text-success" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-display font-bold text-success mb-1",
							children: "Checked In!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-semibold",
							children: checkedInReg.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground font-mono mt-1",
							children: checkedInReg.uniqueId
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: reset,
							className: "mt-6",
							children: "Check In Next Attendee"
						})
					]
				}) : result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border border-border rounded-2xl p-6 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display font-semibold mb-4",
							children: "Attendee Found"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "space-y-3 text-sm mb-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "ID"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-mono font-bold text-primary",
										children: result.id
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-medium",
										children: result.name
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: result.email })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => handleCheckIn(result.id),
								disabled: checkInMutation.isPending,
								className: "flex-1",
								children: [checkInMutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-4 h-4" }), "Confirm Check-In"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: reset,
								children: "Cancel"
							})]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm text-destructive flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-4 h-4" }),
								" ",
								error
							]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card border border-border rounded-2xl p-6 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display font-semibold",
									children: "QR Code Scanner"
								}), scanning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "default",
									className: "bg-success/10 text-success",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-3 h-3 mr-1" }), " Active"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraOff, { className: "w-3 h-3 mr-1" }), " Inactive"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								id: "qr-scanner",
								ref: scannerDivRef,
								className: `w-full aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center ${scanning ? "" : "hidden"}`
							}),
							!scanning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center py-12",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-12 h-12 text-muted-foreground/40 mx-auto mb-4" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground text-sm mb-4",
										children: "Click below to start the camera and scan attendee QR codes."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: startScanner,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-4 h-4" }), " Start Camera Scanner"]
									}),
									error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-3 text-sm text-destructive flex items-center justify-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-4 h-4" }),
											" ",
											error
										]
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground mb-3",
										children: "Point the camera at the attendee's QR code."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										onClick: stopScanner,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraOff, { className: "w-4 h-4" }), " Stop Scanner"]
									}),
									error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-3 text-sm text-destructive flex items-center justify-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-4 h-4" }),
											" ",
											error
										]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 flex items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full border-t border-border" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative flex justify-center text-xs uppercase",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-background px-2 text-muted-foreground",
								children: "or enter manually"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card border border-border rounded-2xl p-6 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display font-semibold mb-4",
								children: "Manual Entry"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: manualId,
									onChange: (e) => setManualId(e.target.value.toUpperCase()),
									placeholder: "Enter unique ID (e.g. CMDA-XXXXXXXX)",
									className: "flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-mono",
									onKeyDown: (e) => e.key === "Enter" && handleManualLookup()
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: handleManualLookup,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-4 h-4" }), " Look Up"]
								})]
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-sm text-destructive flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-4 h-4" }),
									" ",
									error
								]
							})
						]
					})
				] })]
			})
		})]
	});
}
//#endregion
export { CheckInPage as component };

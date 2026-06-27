import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as getRegistration } from "./api-BHruxrT0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/confirmation._id-CVHLgS-G.js
var $$splitComponentImporter = () => import("./confirmation._id-C7T1p95S.mjs");
var Route = createFileRoute("/confirmation/$id")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	loader: async ({ params }) => {
		return { reg: await getRegistration({ data: params.id }) };
	},
	head: () => ({ meta: [{ title: "Registration Confirmed — CMDA Americas Retreat 2026" }] })
});
//#endregion
export { Route as t };

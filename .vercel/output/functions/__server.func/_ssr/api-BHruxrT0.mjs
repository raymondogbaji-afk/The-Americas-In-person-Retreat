import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-Bz9Ttzbl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-BHruxrT0.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var submitRegistration = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("245ea38c217cf20c91134eb32a98e5b6795fdeb094bc6b129a418acb9a85ca2d"));
var listRegistrations = createServerFn({ method: "GET" }).handler(createSsrRpc("2fbb83f4b26f0382d20685bda4447392f67f514190ff27e6a12b5eebd7f5e551"));
var getRegistration = createServerFn({ method: "GET" }).validator((id) => id).handler(createSsrRpc("c97c532805ac7e6c6b47286662565b8390f2ec62be788d13961b0e9b616445e4"));
var checkInAttendee = createServerFn({ method: "POST" }).validator((id) => id).handler(createSsrRpc("e0b49254a5388d3ac5974b764e4c4b31ce6cb75d7215142e620c5e17adcd3497"));
var getStats = createServerFn({ method: "GET" }).handler(createSsrRpc("6b52bd689324a00657050155ca18337e65e2c9c00f9b71cb57a7d82915acd0e2"));
//#endregion
export { submitRegistration as a, listRegistrations as i, getRegistration as n, getStats as r, checkInAttendee as t };

//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-Bz9Ttzbl.js
var manifest = {
	"245ea38c217cf20c91134eb32a98e5b6795fdeb094bc6b129a418acb9a85ca2d": {
		functionName: "submitRegistration_createServerFn_handler",
		importer: () => import("./_ssr/api-CU0Uipyx.mjs")
	},
	"2fbb83f4b26f0382d20685bda4447392f67f514190ff27e6a12b5eebd7f5e551": {
		functionName: "listRegistrations_createServerFn_handler",
		importer: () => import("./_ssr/api-CU0Uipyx.mjs")
	},
	"6b52bd689324a00657050155ca18337e65e2c9c00f9b71cb57a7d82915acd0e2": {
		functionName: "getStats_createServerFn_handler",
		importer: () => import("./_ssr/api-CU0Uipyx.mjs")
	},
	"c97c532805ac7e6c6b47286662565b8390f2ec62be788d13961b0e9b616445e4": {
		functionName: "getRegistration_createServerFn_handler",
		importer: () => import("./_ssr/api-CU0Uipyx.mjs")
	},
	"e0b49254a5388d3ac5974b764e4c4b31ce6cb75d7215142e620c5e17adcd3497": {
		functionName: "checkInAttendee_createServerFn_handler",
		importer: () => import("./_ssr/api-CU0Uipyx.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };

// All APIs are versioned, since we can't expect everyone to necessarily always
// be on the latest version of the PWA, and we might need to make breaking
// changes sometimes.

// TODO: Consider using zod v4.5 .compile() and .validate() methods to speed up
// server-side validation. (`validate` is good for prod, but we might still
// prefer `parse` for dev so that debugging errors is easier.)

export { api as ABOUT_PAGE_V1 } from "./about-page/v1/index.js";
export { api as DEPARTURES_V0 } from "./departures/v0/index.js";
export { api as FOUNDATIONAL_DATA_V1 } from "./foundational-data/v1/index.js";
export { api as SERVICE_V0 } from "./service/v0/index.js";
export { api as VERSION_CHECK_V1 } from "./version-check/v1/index.js";
export { api as VERSIONS_V1 } from "./versions/v1/index.js";

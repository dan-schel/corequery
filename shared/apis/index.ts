// All APIs are versioned, since we can't expect everyone to necessarily always
// be on the latest version of the PWA, and we might need to make breaking
// changes sometimes.

export { api as FOUNDATIONAL_DATA_V1 } from "./foundational-data/v1/index.js";
export { api as VERSION_CHECK_V1 } from "./version-check/v1/index.js";
export { api as VERSIONS_V1 } from "./versions/v1/index.js";

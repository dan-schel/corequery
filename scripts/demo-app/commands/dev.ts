import { logInfo, runDemoAppWithCommand } from "../utils";

logInfo("Running demo app (with hot-reloading)...");

// Two aspects of hot-reloading:
// - `COREQUERY_HOT_RELOAD=true` to tell the server to use the vite dev
//   middleware and therefore have hot-reloading for the frontend.
// - `npm run dev` to hot-reload the server code.
runDemoAppWithCommand("COREQUERY_HOT_RELOAD=true npm run dev");

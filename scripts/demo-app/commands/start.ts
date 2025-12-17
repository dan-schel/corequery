import { logInfo, runDemoAppWithCommand } from "../utils";

logInfo("Running demo app...");

// TODO: As we're running `npm run start`, it could be reasonable to assume the
// demo-app project needs an `npm run build` step first, if it's not using
// `tsx`.
//
// Consider running it if it exists in the package.json, or (even better)
// somehow allowing the demo-app repo to specify what we should do in it's
// package.json or something (we could also put env var setup guidance in
// there).

runDemoAppWithCommand("npm run start");

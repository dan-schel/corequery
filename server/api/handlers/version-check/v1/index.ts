import type { VERSION_CHECK_V1 } from "@/shared/apis/index.js";
import type { ApiContext } from "@/server/api/types.js";
import type { ArgsOf, ResultOf } from "@/shared/apis/types.js";

// eslint-disable-next-line @typescript-eslint/require-await
export async function handle(
  _ctx: ApiContext,
  _args: ArgsOf<typeof VERSION_CHECK_V1>,
): Promise<ResultOf<typeof VERSION_CHECK_V1>> {
  return {
    // In theory, one day we might want a way to ensure old versions of the app
    // are updated automatically upon loading, e.g. to deprecate an old version
    // of an API. If we return `isForceUpdateOfServiceWorkerRequired: true`, the
    // frontend will automatically unregister the service worker and reload the
    // page.
    //
    // We can decide this based on the frontend version or corequery package
    // version, as they're each given in the args. My current thinking is that
    // this'll primarily to be used such that we define a "minimum supported
    // corequery package version", as most breaking changes will happen within
    // the corequery project itself, not a consumer project configuration
    // change. But "frontend version" is there just in case (harder to use
    // though, as it's based on a random hash right now, not a nicely ordered
    // versioning system).
    isForceUpdateOfServiceWorkerRequired: false,
  };
}

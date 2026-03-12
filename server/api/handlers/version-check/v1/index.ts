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
    // page. We can decide this based on the frontend version, corequery package
    // version or foundational data hash, as they're each given in the args.
    isForceUpdateOfServiceWorkerRequired: false,

    // I'm less sure why we'd ever need to use this. In theory, all APIs which
    // return data which depends on a certain foundational data version will
    // already take the current hash from the frontend and return updated
    // foundational data if it doesn't match the latest hash, so that already
    // serves as a way to "force" the update when it actually counts.
    // Regardless, this exists and can be used in case of emergency I suppose.
    isForceUpdateOfFoundationalDataRequired: false,
  };
}

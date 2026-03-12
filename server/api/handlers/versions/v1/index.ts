import type { VERSIONS_V1 } from "@/shared/apis/index.js";
import type { ApiContext } from "@/server/api/types.js";
import type { ArgsOf, ResultOf } from "@/shared/apis/types.js";
import { FoundationalDataV1Builder } from "@/server/api/handlers/foundational-data/v1/builder.js";

// eslint-disable-next-line @typescript-eslint/require-await
export async function handle(
  ctx: ApiContext,
  _args: ArgsOf<typeof VERSIONS_V1>,
): Promise<ResultOf<typeof VERSIONS_V1>> {
  const foda = new FoundationalDataV1Builder(ctx.app).build();

  return {
    serverVersion: ctx.app.version,

    // One day, this will diverge from the server version, because the frontend
    // code doesn't necessarily change in every release of the corequery
    // package, let alone every commit in a consumer package (which is what
    // serverVersion is based on). My current thinking is that it can be based
    // on a hash of the sw.js file (which includes hashes of all the files it
    // pre-caches).
    frontendVersion: ctx.app.version,

    corequeryPackageVersion: ctx.app.corequeryPackageVersion,
    foundationalDataHash: foda.metadata.hash,

    // Deprecated, but kept for backwards compatibility.
    version: ctx.app.version,
  };
}

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
    serverVersion: ctx.app.serverVersion,
    frontendVersion: ctx.app.getFrontendVersion(),
    corequeryPackageVersion: ctx.app.getCorequeryPackageVersion(),
    foundationalDataHash: foda.metadata.hash,

    // Deprecated, but kept for backwards compatibility.
    version: ctx.app.serverVersion,
  };
}

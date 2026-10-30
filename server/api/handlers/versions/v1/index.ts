import type { VERSIONS_V1 } from "@/shared/apis/index.js";
import type { ApiContext } from "@/server/api/types.js";
import type { ArgsOf, ResultOf } from "@/shared/apis/types.js";
import { MultiversionalFoda } from "@/server/api/handlers/foundational-data/multiversional/multiversional-foda.js";

export function handle(
  ctx: ApiContext,
  _args: ArgsOf<typeof VERSIONS_V1>,
): Promise<ResultOf<typeof VERSIONS_V1>> {
  return Promise.resolve({
    serverVersion: ctx.app.serverVersion,
    frontendVersion: ctx.app.getFrontendVersion(),
    corequeryPackageVersion: ctx.app.getCorequeryPackageVersion(),

    // TODO: See note in server/api/handlers/foundational-data/v1/index.ts about
    // memoization.
    foundationalDataHash: MultiversionalFoda.build(ctx.app).calculateHash(),

    // Deprecated, but kept for backwards compatibility.
    version: ctx.app.serverVersion,
  });
}

import type { VERSIONS_V1 } from "@/shared/apis/index.js";
import type { ApiContext } from "@/server/api/types.js";
import type { ServerArgsOf, ServerResultOf } from "@/server/api/types.js";

export function handle(
  ctx: ApiContext,
  _args: ServerArgsOf<typeof VERSIONS_V1>,
): Promise<ServerResultOf<typeof VERSIONS_V1>> {
  return Promise.resolve({
    serverVersion: ctx.app.serverVersion,
    frontendVersion: ctx.app.getFrontendVersion(),
    corequeryPackageVersion: ctx.app.getCorequeryPackageVersion(),
    foundationalDataHash: ctx.app.foda.hash,

    // Deprecated, but kept for backwards compatibility.
    version: ctx.app.serverVersion,
  });
}

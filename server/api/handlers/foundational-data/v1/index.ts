import type { FOUNDATIONAL_DATA_V1 } from "@/shared/apis/index.js";
import type { ApiContext } from "@/server/api/types.js";
import type { ServerArgsOf, ServerResultOf } from "@/server/api/types.js";

export function handle(
  ctx: ApiContext,
  args: ServerArgsOf<typeof FOUNDATIONAL_DATA_V1>,
): Promise<ServerResultOf<typeof FOUNDATIONAL_DATA_V1>> {
  // await new Promise((resolve) => setTimeout(resolve, 500));

  const hash = ctx.app.foda.hash;

  if (args.hash === hash) {
    return Promise.resolve({ result: "up-to-date" });
  }

  return Promise.resolve({
    result: "outdated",
    foundationalData: ctx.app.foda.toFodaV1(),
  });
}

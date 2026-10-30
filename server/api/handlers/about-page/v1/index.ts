import type { ABOUT_PAGE_V1 } from "@/shared/apis/index.js";
import type { ApiContext } from "@/server/api/types.js";
import type { ServerArgsOf, ServerResultOf } from "@/shared/apis/types.js";

export function handle(
  ctx: ApiContext,
  _args: ServerArgsOf<typeof ABOUT_PAGE_V1>,
): Promise<ServerResultOf<typeof ABOUT_PAGE_V1>> {
  return Promise.resolve({
    primaryMarkdown: ctx.app.aboutPageConfig.primaryMarkdown,
  });
}

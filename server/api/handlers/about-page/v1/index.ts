import type { ABOUT_PAGE_V1 } from "@/shared/apis/index.js";
import type { ApiContext } from "@/server/api/types.js";
import type { ArgsOf, ResultOf } from "@/shared/apis/types.js";

export function handle(
  ctx: ApiContext,
  _args: ArgsOf<typeof ABOUT_PAGE_V1>,
): Promise<ResultOf<typeof ABOUT_PAGE_V1>> {
  return Promise.resolve({
    primaryMarkdown: ctx.app.aboutPageConfig.primaryMarkdown,
  });
}

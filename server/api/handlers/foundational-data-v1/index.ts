import type { FOUNDATIONAL_DATA_V1 } from "@/shared/apis/index.js";
import type { ApiContext } from "@/server/api/types.js";
import type { ArgsOf, ResultOf } from "@/shared/apis/types.js";
import { uuid } from "@dan-schel/js-utils";

// eslint-disable-next-line @typescript-eslint/require-await
export async function handle(
  ctx: ApiContext,
  _args: ArgsOf<typeof FOUNDATIONAL_DATA_V1>,
): Promise<ResultOf<typeof FOUNDATIONAL_DATA_V1>> {
  // await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    // TODO: Real data.
    metadata: {
      hash: uuid(),
      serverVersion: "hello",
    },
    stops: ctx.app.stops.map((s) => s.toFoda()),
    lines: ctx.app.lines.map((l) => l.toFoda()),
    landingPage: {
      primaryMarkdown: "",
    },
    footer: {
      primaryMarkdown: "",
    },
  };
}

import type { FOUNDATIONAL_DATA_V1 } from "@/shared/apis/index.js";
import type { ApiContext } from "@/server/api/types.js";
import type { ArgsOf, ResultOf } from "@/shared/apis/types.js";

// eslint-disable-next-line @typescript-eslint/require-await
export async function handle(
  _ctx: ApiContext,
  _args: ArgsOf<typeof FOUNDATIONAL_DATA_V1>,
): Promise<ResultOf<typeof FOUNDATIONAL_DATA_V1>> {
  return {
    // TODO: Real data.
    metadata: {
      hash: "abc123",
      serverVersion: "hello",
    },
    stops: [],
    lines: [],
    landingPage: {
      primaryMarkdown: "",
    },
    footer: {
      primaryMarkdown: "",
    },
  };
}

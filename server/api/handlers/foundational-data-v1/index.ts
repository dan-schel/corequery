import type { FOUNDATIONAL_DATA_V1 } from "@/shared/apis/index.js";
import type { ApiContext } from "@/server/api/types.js";
import type { ArgsOf, ResultOf } from "@/shared/apis/types.js";
import { FoundationalDataV1Builder } from "@/server/api/handlers/foundational-data-v1/builder.js";

// eslint-disable-next-line @typescript-eslint/require-await
export async function handle(
  ctx: ApiContext,
  args: ArgsOf<typeof FOUNDATIONAL_DATA_V1>,
): Promise<ResultOf<typeof FOUNDATIONAL_DATA_V1>> {
  // await new Promise((resolve) => setTimeout(resolve, 500));

  const foda = new FoundationalDataV1Builder(ctx.app).build();

  if (args.hash === foda.metadata.hash) return { result: "up-to-date" };

  return { result: "outdated", foundationalData: foda };
}

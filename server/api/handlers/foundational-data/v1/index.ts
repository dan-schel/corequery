import type { FOUNDATIONAL_DATA_V1 } from "@/shared/apis/index.js";
import type { ApiContext } from "@/server/api/types.js";
import type { ArgsOf, ResultOf } from "@/shared/apis/types.js";
import { MultiversionalFoda } from "@/server/api/handlers/foundational-data/multiversional/multiversional-foda.js";

export function handle(
  ctx: ApiContext,
  args: ArgsOf<typeof FOUNDATIONAL_DATA_V1>,
): Promise<ResultOf<typeof FOUNDATIONAL_DATA_V1>> {
  // await new Promise((resolve) => setTimeout(resolve, 500));

  // We should probably consider memoizing the multiversional FODA object on
  // ctx.app or something, as right now, only a server configuration change
  // would cause it to change. I don't know if that'll always be true going
  // forward.
  const foda = MultiversionalFoda.build(ctx.app);
  const hash = foda.calculateHash();

  if (args.hash === hash) {
    return Promise.resolve({ result: "up-to-date" });
  }

  return Promise.resolve({
    result: "outdated",
    foundationalData: foda.toFodaV1(hash),
  });
}

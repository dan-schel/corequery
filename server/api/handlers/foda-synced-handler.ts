import type { ApiContext } from "@/server/api/types.js";

export async function applyFodaSyncedResult<CustomContextType, Result>(
  ctx: ApiContext<CustomContextType>,
  func: () => Promise<Result>,
) {
  const foundationalDataHash = ctx.app.foda.hash;
  const innerResult = await func();

  return { foundationalDataHash, innerResult };
}

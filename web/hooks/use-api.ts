import type { Api } from "@/shared/apis/types";
import { z, type ZodType } from "zod";

export type CallApiOptions = {
  timeout?: number | null;
  debugDelay?: number;
  debugError?: boolean;
};

export function useApi() {
  return { callApi };
}

async function callApi<Args, Result>(
  api: Api<ZodType<unknown, Args>, ZodType<Result>>,
  args: Args,
  options: CallApiOptions = {},
): Promise<Result> {
  const { timeout, debugDelay, debugError } = options;

  if (debugDelay != null) {
    await new Promise((resolve) => setTimeout(resolve, debugDelay));
  }
  if (debugError ?? false) {
    throw new Error("Simulated API error");
  }

  const res = await fetch(`/api${api.path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    signal: timeout != null ? AbortSignal.timeout(timeout) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status} calling /api${api.path}: ${text}`);
  }

  return api.resultSchema.parse(await res.json());
}

async function callFodaSyncedApi<Args, Result>(
  api: Api<ZodType<unknown, Args>, ZodType<Result>>,
  args: Args,
  options: CallApiOptions = {},
): Promise<{ innerResult: Result; foundationalDataHash: string }> {
  const resultSchema = z.object({
    innerResult: api.resultSchema,
    foundationalDataHash: z.string(),
  });

  const newApi = {
    ...api,
    resultSchema,
  };

  const result = await callApi(newApi, args, options);

  return {
    innerResult: result.innerResult,
    foundationalDataHash: result.foundationalDataHash,
  };
}

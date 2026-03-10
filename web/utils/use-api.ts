import type { Api } from "@/shared/apis/types";
import type { z, ZodType } from "zod";

export type CallApiOptions = {
  timeout?: number | null;
  debugDelay?: number;
  debugError?: boolean;
};

export type CallApiFunction = typeof callApi;

export function useApi() {
  return { callApi };
}

async function callApi<Args extends ZodType, Result extends ZodType>(
  api: Api<Args, Result>,
  args: z.input<Args>,
  options: CallApiOptions = {},
): Promise<z.infer<Result>> {
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

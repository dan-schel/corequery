import type { ApiClient } from "@/web/hooks/api/types";

export type CallApiOptions = {
  timeout?: number | null;
  debugDelay?: number;
  debugError?: boolean;
};

export function useApi() {
  return { callApi };
}

async function callApi<Args, Result>(
  api: ApiClient<Args, Result>,

  // NoInfer ensures that the types are inferred purely from the `api` type.
  args: NoInfer<Args>,

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

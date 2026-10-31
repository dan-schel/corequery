import type { ApiClient } from "@/web/hooks/api/types";
import { useState } from "preact/hooks";
import { useApi, type CallApiOptions } from "@/web/hooks/api/use-api";

/** @knipignore */
export function useMutation<Args, Result>(
  api: ApiClient<Args, Result>,
  options: CallApiOptions = {},
) {
  const { callApi } = useApi();
  const [loading, setLoading] = useState(false);

  async function call(args: Args) {
    // Don't catch the error here, let the caller deal with it.
    try {
      setLoading(true);
      return await callApi(api, args, options);
    } finally {
      setLoading(false);
    }
  }

  return { call, loading };
}

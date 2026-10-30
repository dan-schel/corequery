import type { ApiClient } from "@/shared/apis/types";
import { useState } from "preact/hooks";
import { useApi, type CallApiOptions } from "@/web/hooks/use-api";

/** @knipignore */
export function useMutation<Args, Result>(
  api: ApiClient<Args, Result>,
  options: CallApiOptions = {},
) {
  const { callApi } = useApi();
  const [loading, setLoading] = useState(false);

  async function call(args: Args) {
    try {
      setLoading(true);
      return await callApi(api, args, options);
    } finally {
      setLoading(false);
    }
  }

  return { call, loading };
}

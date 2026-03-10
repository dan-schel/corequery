import type { Api } from "@/shared/apis/types";
import { useState } from "preact/hooks";
import type { z, ZodType } from "zod";
import { useApi, type CallApiOptions } from "@/web/hooks/use-api";

/** @knipignore */
export function useMutation<Args extends ZodType, Result extends ZodType>(
  api: Api<Args, Result>,
  options: CallApiOptions = {},
) {
  const { callApi } = useApi();
  const [loading, setLoading] = useState(false);

  async function call(args: z.input<Args>) {
    try {
      setLoading(true);
      return await callApi(api, args, options);
    } finally {
      setLoading(false);
    }
  }

  return { call, loading };
}

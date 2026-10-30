import type { Api } from "@/shared/apis/types";
import { useState } from "preact/hooks";
import type { z, ZodType } from "zod";
import { useDeepCompareEffect } from "@/web/hooks/use-deep-compare-effect";
import { useApi, type CallApiOptions } from "@/web/hooks/use-api";

export type UseQueryResult<T extends Api<ZodType, ZodType>> = ReturnType<
  typeof useQuery<z.input<T["argsSchema"]>, z.output<T["resultSchema"]>>
>;

export function useQuery<Args, Result>(
  api: Api<ZodType<unknown, Args>, ZodType<Result>>,
  args: Args,
  options: CallApiOptions = {},
) {
  const { callApi } = useApi();

  const [data, setData] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useDeepCompareEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const result = await callApi(api, args, options);
        if (!cancelled) setData(result);
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchData();

    return () => {
      cancelled = true;
    };
  }, [api, args, options]);

  return { data, loading, error };
}

import type {
  ApiClient,
  ClientArgsOf,
  ClientResultOf,
} from "@/web/hooks/api/types";
import { useState } from "preact/hooks";
import { useDeepCompareEffect } from "@/web/hooks/use-deep-compare-effect";
import { useApi, type CallApiOptions } from "@/web/hooks/api/use-api";

export type UseQueryResult<T extends ApiClient<unknown, unknown>> = ReturnType<
  typeof useQuery<ClientArgsOf<T>, ClientResultOf<T>>
>;

export function useQuery<Args, Result>(
  api: ApiClient<Args, Result>,

  // NoInfer ensures that the types are inferred purely from the `api` type.
  args: NoInfer<Args>,

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
        if (cancelled) return;

        setData(result);
      } catch (e) {
        if (cancelled) return;

        console.warn(e);
        setError(e);
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

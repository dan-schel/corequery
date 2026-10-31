import type {
  ApiClient,
  ClientArgsOf,
  ClientResultOf,
} from "@/web/hooks/api/types";
import { useState } from "preact/hooks";
import { useDeepCompareEffect } from "@/web/hooks/use-deep-compare-effect";
import { useApi, type CallApiOptions } from "@/web/hooks/api/use-api";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";

type FodaSyncedResult = {
  innerResult: unknown;
  foundationalDataHash: string;
};

/** @knipignore */
export type UseFodaSyncedQueryResult<
  T extends ApiClient<unknown, FodaSyncedResult>,
> = ReturnType<typeof useFodaSyncedQuery<ClientArgsOf<T>, ClientResultOf<T>>>;

export function useFodaSyncedQuery<Args, Result extends FodaSyncedResult>(
  api: ApiClient<Args, Result>,

  // NoInfer ensures that the types are inferred purely from the `api` type.
  args: NoInfer<Args>,

  options: CallApiOptions = {},
) {
  const { callApi } = useApi();
  const { foda, forceFodaUpdate } = useFoundationalData();

  const [data, setData] = useState<Result["innerResult"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useDeepCompareEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const result = await callApi(api, args, options);

        if (!cancelled && result.foundationalDataHash !== foda.hash) {
          await forceFodaUpdate();
        }

        if (!cancelled) {
          if (result.foundationalDataHash !== foda.hash) {
            // The forced update might receive even newer FODA (with a different
            // hash than what the API result contained), or maybe we're
            // mid-deploy in a horizontally scaled environment, and some
            // requests are going to updated instances with newer FODA, and
            // others not.
            //
            // Either way, this is a known issue, and was traded-off against
            // returning the full FODA object in every FODA-synced API response,
            // and dealing with the versioning cascade that would occur anytime
            // a breaking change occurred in the foundational data.
            //
            // (See docs/foda-synced-queries-adr.md.)
            throw new Error(
              "Foundational data hash still mismatches after forced update.",
            );
          }

          setData(result.innerResult);
        }
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

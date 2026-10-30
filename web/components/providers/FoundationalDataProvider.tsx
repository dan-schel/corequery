import { type ComponentChildren } from "preact";
import { FOUNDATIONAL_DATA_V1 } from "@/shared/apis";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { FoundationalData } from "@/web/data/foundational-data";
import { useLocalStorage } from "@/web/hooks/use-local-storage";
import { SplashScreen } from "@/web/components/SplashScreen";
import { foundationalDataContext } from "@/web/hooks/use-foundational-data";
import { useApi, type CallApiFunction } from "@/web/hooks/use-api";
import { useSettings } from "@/web/hooks/use-settings";

const cacheKey = "corequery-foundational-data";
const cacheFallbackTimeoutMs = 2000;

type FoundationalDataProviderProps = {
  children: ComponentChildren;
};

export function FoundationalDataProvider(props: FoundationalDataProviderProps) {
  const { Provider } = foundationalDataContext;

  const { revalidateSettings } = useSettings();

  const { callApi } = useApi();
  const cache = useLocalStorage(cacheKey, FoundationalData.json);
  const [cachedData] = useState(() => cache.get());

  const [foda, setFoda] = useState<FoundationalData | null>(null);
  const [error, setError] = useState(false);

  const updateFoda = useCallback(
    (newFoda: FoundationalData) => {
      setFoda(newFoda);
      revalidateSettings(newFoda);
      cache.set(newFoda.toJson());
    },
    [cache, revalidateSettings],
  );

  const forceFodaUpdate = useCallback(async () => {
    // This function gets call if:
    //
    // - We're on a "Not found" page that called the versions API, and noticed
    //   that the foundational data is outdated.
    //
    // - We called a FODA-synced query, and the result came back indicating that
    //   the foundational data is outdated.
    //
    // Therefore, in either case, there's no point passing the current FODA hash
    // as we already know it's outdated. (And given the name of the function is
    // "force update", it would be misleading not to re-retrieve the full FODA
    // value and store it.)
    const response = await callApi(FOUNDATIONAL_DATA_V1, { hash: null });

    // Can't happen as we didn't give a hash!
    if (response.result === "up-to-date") throw new Error();

    updateFoda(new FoundationalData(response.foundationalData));
  }, [callApi, updateFoda]);

  const triggerLoadData = useCallback(() => {
    setError(false);
    void loadData({
      callApi,
      cachedData,
      onDataReady: (data, shouldBeCached) => {
        updateFoda(data);

        // TODO: Due to the line diagram fallback type bug, I think we should
        // always store the foundational data verbatim as we receive it from the
        // server, not just the fields parsed by Zod as we currently do.
        //
        // This would involve changing the foundational data API schema to
        // accept literally anything for `foundationalData`, and once saved in
        // localstorage, parse the value, and save that parsed value to state.
        //
        // (Note that I've already fixed that specific bug, but this change
        // would future-proof against that whole class of bugs, and prevents the
        // app needlessly needing to re-download the FODA when the PWA updates
        // after a schema change, even though it's on the latest hash which is
        // still necessary at the time of writing.)
        if (shouldBeCached) {
          cache.set(data.toJson());
        }
      },
      onFailure: () => {
        setError(true);
      },
    });
  }, [cache, cachedData, callApi, updateFoda]);

  useEffect(() => {
    triggerLoadData();
  }, [triggerLoadData]);

  const value = useMemo(() => {
    if (foda == null) return null;
    return { foda, forceFodaUpdate };
  }, [foda, forceFodaUpdate]);

  if (value == null) {
    return <SplashScreen error={error} onRetry={triggerLoadData} />;
  }

  return <Provider value={value}>{props.children}</Provider>;
}

async function loadData({
  callApi,
  cachedData,
  onDataReady,
  onFailure,
}: {
  callApi: CallApiFunction;
  cachedData: FoundationalData | null;
  onDataReady: (data: FoundationalData, shouldBeCached: boolean) => void;
  onFailure: () => void;
}) {
  if (cachedData != null) {
    try {
      const response = await callApi(
        FOUNDATIONAL_DATA_V1,
        { hash: cachedData.hash },
        { timeout: cacheFallbackTimeoutMs },
      );

      if (response.result === "up-to-date") {
        onDataReady(cachedData, false);
      } else {
        onDataReady(new FoundationalData(response.foundationalData), true);
      }
    } catch (err) {
      console.warn("Foundational data refresh failed - using cache.", err);
      onDataReady(cachedData, false);
    }
  } else {
    try {
      const response = await callApi(FOUNDATIONAL_DATA_V1, { hash: null });
      if (response.result === "up-to-date") throw new Error("Huh?");

      onDataReady(new FoundationalData(response.foundationalData), true);
    } catch {
      onFailure();
    }
  }
}

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

      // TODO: Write it to the cache?
    },
    [revalidateSettings],
  );

  const triggerLoadData = useCallback(() => {
    setError(false);
    void loadData({
      callApi,
      cachedData,
      onDataReady: (data, shouldBeCached) => {
        updateFoda(data);

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
    return { foda, updateFoda };
  }, [foda, updateFoda]);

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

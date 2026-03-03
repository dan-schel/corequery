import { type ComponentChildren } from "preact";
import { foundationalDataContext } from "@/web/data/foundational-data/context";
import { callApi } from "@/web/utils/api";
import { FOUNDATIONAL_DATA_V1 } from "@/shared/apis";
import { useCallback, useEffect, useState } from "preact/hooks";
import { FoundationalData } from "@/web/data/foundational-data";
import { useLocalStorage } from "@/web/utils/use-local-storage";
import { SplashScreen } from "@/web/components/SplashScreen";

const cacheKey = "corequery-foundational-data";
const cacheFallbackTimeoutMs = 1000;

type FoundationalDataProviderProps = {
  children: ComponentChildren;
};

export function FoundationalDataProvider(props: FoundationalDataProviderProps) {
  const { Provider } = foundationalDataContext;

  const cache = useLocalStorage(cacheKey, FoundationalData.json);

  const [cachedData] = useState(() => cache.get());
  const [foda, setFoda] = useState<FoundationalData | null>(null);
  const [error, setError] = useState(false);

  const triggerLoadData = useCallback(() => {
    setError(false);
    void loadData({
      cachedData,

      onDataReady: (data, shouldBeCached) => {
        setFoda(data);

        if (shouldBeCached) {
          cache.set(data.toJson());
        }
      },

      onFailure: () => {
        setError(true);
      },
    });
  }, [cache, cachedData]);

  useEffect(() => {
    triggerLoadData();
  }, [triggerLoadData]);

  if (foda == null) {
    return <SplashScreen error={error} onRetry={triggerLoadData} />;
  }

  return <Provider value={foda}>{props.children}</Provider>;
}

async function loadData({
  cachedData,
  onDataReady,
  onFailure,
}: {
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

import { type ComponentChildren } from "preact";
import { foundationalDataContext } from "@/web/data/foundational-data/context";
import { callApi } from "@/web/utils/api";
import { FOUNDATIONAL_DATA_V1 } from "@/shared/apis";
import { useEffect, useState } from "preact/hooks";
import { FoundationalData } from "@/web/data/foundational-data";
import { useLocalStorage } from "@/web/utils/use-local-storage";
import { TextBlock } from "@/web/components/core/TextBlock";

type FoundationalDataProviderProps = {
  children: ComponentChildren;
};

const cacheKey = "corequery-foundational-data";
const cacheFallbackTimeoutMs = 1000;

export function FoundationalDataProvider(props: FoundationalDataProviderProps) {
  const { Provider } = foundationalDataContext;

  const cache = useLocalStorage(cacheKey, FoundationalData.json);

  const [cachedData] = useState(() => cache.get());
  const [foda, setFoda] = useState<FoundationalData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
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

  if (foda == null) {
    // TODO: Make a splash screen!
    if (error) {
      return <TextBlock>Failed to load data.</TextBlock>;
    } else {
      return <TextBlock>Loading...</TextBlock>;
    }
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
      const data = await callApi(
        FOUNDATIONAL_DATA_V1,

        // TODO: Pass along the current hash, and then the server can skip
        // sending the whole payload every time when the data hasn't changed.
        {},

        { timeout: cacheFallbackTimeoutMs },
      );
      onDataReady(new FoundationalData(data), true);
    } catch {
      onDataReady(cachedData, false);
    }
  } else {
    try {
      const data = await callApi(FOUNDATIONAL_DATA_V1, {});
      onDataReady(new FoundationalData(data), true);
    } catch {
      onFailure();
    }
  }
}

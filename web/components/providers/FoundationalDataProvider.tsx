import { type ComponentChildren } from "preact";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import z from "zod";
import { FOUNDATIONAL_DATA_V1 } from "@/shared/apis";
import { FoundationalData } from "@/web/data/foundational-data";
import { useLocalStorage } from "@/web/hooks/use-local-storage";
import { SplashScreen } from "@/web/components/SplashScreen";
import { foundationalDataContext } from "@/web/hooks/use-foundational-data";
import { useSettings } from "@/web/hooks/use-settings";

// The frontend is currently configured to query for V1 of the foundational
// data. To change that, you should only need to change:
// - these two variables, and
// - the one used in FoundationalData.json.
//
// Anytime data in the cache fails to validate, it'll just get thrown out and
// refetched, so you don't need to worry about that.
//
// You might not need to change `foundationalDataResponseSchema` if the new
// version of the API only changes stuff within `foundationalData`.
const foundationalDataApi = FOUNDATIONAL_DATA_V1;
const responseSchema = z.union([
  z.object({
    result: z.literal("outdated"),
    foundationalData: z.unknown(),
  }),
  z.object({
    result: z.literal("up-to-date"),
  }),
]);

const cacheKey = "corequery-foundational-data";
const cacheFallbackTimeoutMs = 2000;

type FoundationalDataProviderProps = {
  children: ComponentChildren;
};

export function FoundationalDataProvider(props: FoundationalDataProviderProps) {
  const { Provider } = foundationalDataContext;
  const { revalidateSettings } = useSettings();

  const cache = useLocalStorage(cacheKey, FoundationalData.json);
  const [cachedData] = useState(() => cache.get());

  const [foda, setFoda] = useState<FoundationalData | null>(null);
  const [error, setError] = useState(false);

  const updateFoda = useCallback(
    (newFoda: FoundationalData) => {
      setFoda(newFoda);
      revalidateSettings(newFoda);
    },
    [revalidateSettings],
  );

  const handleNewRawFoda = useCallback(
    (newRawFoda: unknown) => {
      const newFoda = FoundationalData.json.parse(newRawFoda);

      updateFoda(newFoda);

      // Note that we cache the raw response, not the parsed result from Zod.
      // (Which means we unfortunately require an `as` cast here.)
      //
      // We do this to account for the fact that when a new field is added to
      // the FODA (i.e, not a breaking change/version bump, just a new field),
      // it's extremely likely that the frontend will update the FODA before it
      // updates the PWA.
      //
      // This means the FODA is parsed by the old version of the frontend, and
      // that's fine because new FODA is still backwards-compatible, but if
      // we save the parsed version (where Zod strips the unknown fields out),
      // then when the frontend DOES eventually update, it'll try to read the
      // cached version, parsing will fail, and it'll need to query the API
      // again. That's a bit weird, because the hash didn't change, nor did the
      // API version, and yet we still need to refetch.
      //
      // We can avoid it by caching the raw response. The server might've
      // returned fields THIS frontend doesn't understand, but it will when it
      // grows up! :)
      //
      // (This whole idea of caching the raw response came about because of line
      // diagrams. The line diagram schema in the foundational data is
      // intentionally loose, so that new line diagram types can be added
      // without a breaking change and therefore new version. The line diagram
      // component has some specific fallback code when it doesn't understand a
      // type. Originally I had a bug where I said "a line diagram is either
      // these strict objects or this looser type as a catch-all", and it meant
      // that anything which parsed as the looser type would be cached as that
      // looser type, and even though later frontend versions understood the
      // newer type, since the FODA hash hadn't changed, it was never
      // re-fetched. I ended up implement a specific fix for that situation, but
      // THIS solution also solves the double fetching issue I mention above,
      // and eliminates this whole CLASS of errors, so I think it's good!)
      cache.set(newRawFoda as z.input<typeof FoundationalData.json>);
    },
    [updateFoda, cache],
  );

  const forceFodaUpdate = useCallback(async () => {
    // This function gets called if:
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
    const response = await fetchFoda(null, null);

    // Can't happen as we didn't give a hash!
    if (response.result === "up-to-date") throw new Error();

    handleNewRawFoda(response.foundationalData);
  }, [handleNewRawFoda]);

  const triggerLoadData = useCallback(() => {
    setError(false);
    void loadData({
      cachedData,
      onFreshFoda: (data) => handleNewRawFoda(data),
      onUseCachedFoda: (data) => updateFoda(data),
      onFailure: () => setError(true),
    });
  }, [cachedData, handleNewRawFoda, updateFoda]);

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
  cachedData,
  onFreshFoda,
  onUseCachedFoda,
  onFailure,
}: {
  cachedData: FoundationalData | null;
  onFreshFoda: (rawFoda: unknown) => void;
  onUseCachedFoda: (cachedData: FoundationalData) => void;
  onFailure: () => void;
}) {
  // No need to check the cachedData's version, as the version is hardcoded as
  // a literal in the schema.
  if (cachedData != null) {
    try {
      const response = await fetchFoda(cachedData.hash, cacheFallbackTimeoutMs);

      if (response.result === "up-to-date") {
        onUseCachedFoda(cachedData);
      } else {
        onFreshFoda(response.foundationalData);
      }
    } catch (err) {
      console.warn("Foundational data refresh failed - using cache.", err);
      onUseCachedFoda(cachedData);
    }
  } else {
    try {
      const response = await fetchFoda(null, null);

      // Can't happen as we didn't give a hash!
      if (response.result === "up-to-date") throw new Error();

      onFreshFoda(response.foundationalData);
    } catch {
      onFailure();
    }
  }
}

// Can't use `callApi` here, as we want the raw value inside `foundationalData`.
async function fetchFoda(hash: string | null, timeout: number | null) {
  const response = await fetch(`/api${foundationalDataApi.path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ hash }),
    signal: timeout != null ? AbortSignal.timeout(timeout) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Error ${response.status} calling /api${foundationalDataApi.path}: ${text}`,
    );
  }

  return responseSchema.parse(await response.json());
}

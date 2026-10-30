import { VERSIONS_V1 } from "@/shared/apis";
import { useEnvironment } from "@/web/hooks/use-environment";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { useQuery, type UseQueryResult } from "@/web/hooks/use-query";
import { useServiceWorker } from "@/web/hooks/use-service-worker";
import { useStaticData } from "@/web/hooks/use-static-data";
import { useEffect, useState } from "preact/hooks";

type VersionsQueryResult = UseQueryResult<typeof VERSIONS_V1>;

export function useVersionAssurance(
  mode: "frontend-version" | "foundational-data-version",
): boolean {
  const versionsQuery = useQuery(VERSIONS_V1, {});

  const pwaIsUpdating = useFrontendVersionAssurance(
    mode === "frontend-version",
    versionsQuery,
  );

  const fodaIsUpdating = useFodaVersionAssurance(
    mode === "foundational-data-version",
    versionsQuery,
  );

  return versionsQuery.loading || pwaIsUpdating || fodaIsUpdating;
}

function useFrontendVersionAssurance(
  active: boolean,
  versionsQuery: VersionsQueryResult,
): boolean {
  const { isHotReloadingEnabled } = useEnvironment();
  const { frontendVersion } = useStaticData();
  const { unregister } = useServiceWorker();

  const pwaIsOutdated =
    active &&
    !isHotReloadingEnabled &&
    !versionsQuery.loading &&
    versionsQuery.error == null &&
    versionsQuery.data != null &&
    versionsQuery.data.frontendVersion !== frontendVersion;

  useEffect(() => {
    if (!pwaIsOutdated) return;

    async function run() {
      await unregister();
      window.location.reload();
    }
    void run();
  }, [pwaIsOutdated, unregister]);

  return pwaIsOutdated;
}

function useFodaVersionAssurance(
  active: boolean,
  versionsQuery: VersionsQueryResult,
): boolean {
  const { foda, forceFodaUpdate } = useFoundationalData();
  const [fodaRefreshAttempted, setFodaRefreshAttempted] = useState(false);
  const [refreshingFoda, setRefreshingFoda] = useState(false);

  const fodaIsOutdated =
    active &&
    !versionsQuery.loading &&
    versionsQuery.error == null &&
    versionsQuery.data != null &&
    versionsQuery.data.foundationalDataHash !== foda.hash;

  useEffect(() => {
    if (!fodaIsOutdated) return;

    async function run() {
      setRefreshingFoda(true);
      try {
        // Technically, there could also be an edge case if the FODA on the
        // server updates AGAIN between the versions api call and the force
        // update. That would mean that even after this `forceFodaUpdate` call,
        // the foda hash STILL won't match the result from the versions api call
        // (because it's now _newer_), and so `fodaIsOutdated` remains `true`
        // even though it has been updated.
        //
        // In that situation, we'll end up showing the "Not found" page, unless
        // of course the new FODA now contains the stop, line, etc. that this
        // URL was looking for. If that's the case, whichever component asked
        // for this "Not found" page to show will flip to displaying content,
        // presumably.
        //
        // It's weird, but even in this edge case, the overall behaviour we want
        // is still what ultimately happens!
        await forceFodaUpdate();
      } catch {
        // If it fails, then the FODA remains outdated and `refreshingFoda`
        // will go back to `false`, meaning we'll show the "Not found" page.
        //
        // We did our best. There's no guarantee updating the FODA would help
        // anyway!
        console.warn("Foundational data is outdated, but force update failed.");
      } finally {
        setFodaRefreshAttempted(true);
        setRefreshingFoda(false);
      }
    }
    void run();
  }, [fodaIsOutdated, forceFodaUpdate]);

  // The `useEffect` above will trigger when `fodaIsOutdated` becomes true, but
  // there'll be a split second where that render happens and triggers the
  // `useEffect` but `refreshingFoda` hasn't been set to `true` yet.
  return (fodaIsOutdated && !fodaRefreshAttempted) || refreshingFoda;
}

import { Column } from "@/web/components/core/Column";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Page } from "@/web/components/page/Page";
import { Button } from "@/web/components/button/Button";
import { MingcuteHome4Line } from "@/web/components/icons/MingcuteHome4Line";
import { LoadingSpinner } from "@/web/components/LoadingSpinner";
import { useQuery } from "@/web/hooks/use-query";
import { VERSIONS_V1 } from "@/shared/apis";
import { useServiceWorker } from "@/web/hooks/use-service-worker";
import { useStaticData } from "@/web/hooks/use-static-data";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { useEnvironment } from "@/web/hooks/use-environment";
import { useEffect, useState } from "preact/hooks";

type NotFoundPageProps = {
  afterConfirming: "frontend-version" | "foundational-data-version";
};

export function NotFoundPage({ afterConfirming }: NotFoundPageProps) {
  const { isHotReloadingEnabled } = useEnvironment();
  const { frontendVersion } = useStaticData();
  const { unregister } = useServiceWorker();
  const { foda, forceFodaUpdate } = useFoundationalData();

  const { data, loading: checkingVersions, error } = useQuery(VERSIONS_V1, {});

  const [fodaRefreshAttempted, setFodaRefreshAttempted] = useState(false);
  const [refreshingFoda, setRefreshingFoda] = useState(false);

  const pwaIsOutdated =
    afterConfirming === "frontend-version" &&
    !isHotReloadingEnabled &&
    !checkingVersions &&
    error == null &&
    data != null &&
    data.frontendVersion !== frontendVersion;

  const fodaIsOutdated =
    afterConfirming === "foundational-data-version" &&
    !checkingVersions &&
    error == null &&
    data != null &&
    data.foundationalDataHash !== foda.hash;

  useEffect(() => {
    if (!pwaIsOutdated) return;

    async function run() {
      await unregister();
      window.location.reload();
    }
    void run();
  }, [pwaIsOutdated, unregister]);

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
  const loading =
    checkingVersions ||
    pwaIsOutdated ||
    (fodaIsOutdated && !fodaRefreshAttempted) ||
    refreshingFoda;

  if (loading) {
    return (
      <Page mobileHeader={null} desktopHeader={null}>
        <Column xAlign="center" yAlign="center">
          <LoadingSpinner />
        </Column>
      </Page>
    );
  }

  return (
    <Page mobileHeader={null} desktopHeader={null}>
      <Column class="px-4 py-8 gap-8" xAlign="center" yAlign="center">
        <TextBlock style="title" align="center">
          Page not found
        </TextBlock>
        <TextBlock align="center">
          This page doesn't exist, at least not anymore!
        </TextBlock>
        <Button href="/" text="Go home" icon={MingcuteHome4Line} />
      </Column>
    </Page>
  );
}

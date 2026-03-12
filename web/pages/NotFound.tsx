import { Column } from "@/web/components/core/Column";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Page } from "@/web/components/page/Page";
import { Button } from "@/web/components/button/Button";
import { MingcuteHome4Line } from "@/web/components/icons/MingcuteHome4Line";
import { useQuery } from "@/web/hooks/use-query";
import { VERSIONS_V1 } from "@/shared/apis";
import { LoadingSpinner } from "@/web/components/LoadingSpinner";
import { useServiceWorker } from "@/web/hooks/use-service-worker";
import { useStaticData } from "@/web/hooks/use-static-data";
import { useEffect } from "preact/hooks";
import { useEnvironment } from "@/web/hooks/use-environment";

export default function NotFound() {
  const { isHotReloadingEnabled } = useEnvironment();
  const { frontendVersion } = useStaticData();
  const { unregister } = useServiceWorker();

  // Ask the server what the latest version of the frontend is. We might've been
  // linked to a page that actually DOES exist, but our PWA is still on an old
  // version which doesn't know about it.
  //
  // If we've reached this "Not found" screen and we find out that our PWA is
  // outdated, we'll force update it to the latest version. Maybe that new
  // version has a page to render, or maybe it ALSO just renders the "Not found"
  // page!
  const { data, loading, error } = useQuery(VERSIONS_V1, {});

  const pwaIsOutdated =
    !isHotReloadingEnabled &&
    !loading &&
    error == null &&
    data != null &&
    data.frontendVersion !== frontendVersion;

  useEffect(() => {
    async function run() {
      if (pwaIsOutdated) {
        await unregister();
        window.location.reload();
      }
    }

    void run();
  }, [pwaIsOutdated, unregister]);

  if (!loading && !pwaIsOutdated) {
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

  return (
    <Page mobileHeader={null} desktopHeader={null}>
      <Column xAlign="center" yAlign="center">
        <LoadingSpinner />
      </Column>
    </Page>
  );
}

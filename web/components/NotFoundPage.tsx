import { Column } from "@/web/components/core/Column";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Page } from "@/web/components/page/Page";
import { Button } from "@/web/components/button/Button";
import { MingcuteHome4Line } from "@/web/components/icons/MingcuteHome4Line";
import { LoadingSpinner } from "@/web/components/LoadingSpinner";
import { useQuery } from "@/web/hooks/use-query";
import { VERSIONS_V1, FOUNDATIONAL_DATA_V1 } from "@/shared/apis";
import { useServiceWorker } from "@/web/hooks/use-service-worker";
import { useStaticData } from "@/web/hooks/use-static-data";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { useEnvironment } from "@/web/hooks/use-environment";
import { useApi } from "@/web/hooks/use-api";
import { useEffect, useState } from "preact/hooks";
import { FoundationalData } from "@/web/data/foundational-data";

type NotFoundPageProps = {
  afterConfirming: "frontend-version" | "foundational-data-version";
};

export function NotFoundPage({ afterConfirming }: NotFoundPageProps) {
  const { isHotReloadingEnabled } = useEnvironment();
  const { frontendVersion } = useStaticData();
  const { unregister } = useServiceWorker();
  const { foda, updateFoda } = useFoundationalData();
  const { callApi } = useApi();

  const { data, loading, error } = useQuery(VERSIONS_V1, {});

  const [refreshingFoda, setRefreshingFoda] = useState(false);

  const pwaIsOutdated =
    afterConfirming === "frontend-version" &&
    !isHotReloadingEnabled &&
    !loading &&
    error == null &&
    data != null &&
    data.frontendVersion !== frontendVersion;

  const fodaIsOutdated =
    afterConfirming === "foundational-data-version" &&
    !loading &&
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
        const response = await callApi(FOUNDATIONAL_DATA_V1, {
          hash: foda.hash,
        });
        if (response.result === "outdated") {
          updateFoda(new FoundationalData(response.foundationalData));
        }
      } catch {
        // Failed to refresh - will show not found.
      } finally {
        setRefreshingFoda(false);
      }
    }
    void run();
  }, [fodaIsOutdated, callApi, foda.hash, updateFoda]);

  if (loading || pwaIsOutdated || refreshingFoda) {
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

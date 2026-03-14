import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/use-simple-headers";
import { VERSIONS_V1 } from "@/shared/apis";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Divider } from "@/web/components/core/Divider";
import { Alert } from "@/web/components/Alert";
import { useStaticData } from "@/web/hooks/use-static-data";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { useQuery } from "@/web/hooks/use-query";
import { AsyncFieldValue } from "@/web/components/pages/debug/AsyncFieldValue";
import { ComparisonHeader } from "@/web/components/pages/debug/ComparisonHeader";
import { OutdatedPwaControls } from "@/web/components/pages/debug/OutdatedPwaControls";
import { useEnvironment } from "@/web/hooks/use-environment";
import { HeaderWithPill } from "@/web/components/pages/debug/HeaderWithPill";

export default function Debug() {
  const { isHotReloadingEnabled } = useEnvironment();
  const { frontendVersion, corequeryPackageVersion } = useStaticData();
  const foda = useFoundationalData();

  const { data, loading, error } = useQuery(VERSIONS_V1, {});

  return (
    <Page {...useSimpleHeaders({ title: "Developer info" })}>
      <Column class="px-4 py-8 gap-8">
        {error != null && (
          <Alert type="error">
            <TextBlock>
              Unable to fetch the latest version info from the server.
            </TextBlock>
          </Alert>
        )}
        {isHotReloadingEnabled ? (
          <Column class="gap-8">
            <Column class="gap-4">
              <HeaderWithPill
                header="App version"
                pillContent={{ text: "Development", type: "info" }}
                loading={false}
              />
              <TextBlock>
                All frontend code is being served with hot-reloading enabled,
                not through the PWA. (The below values are meaningless.)
              </TextBlock>
            </Column>
            <Column class="gap-4">
              <TextBlock>Current version: {frontendVersion}</TextBlock>
              <AsyncFieldValue
                prefix="Latest version"
                value={data?.frontendVersion ?? null}
                loading={loading}
              />
            </Column>
          </Column>
        ) : (
          <Column class="gap-8">
            <Column class="gap-4">
              <ComparisonHeader
                header="App version"
                currentValue={frontendVersion}
                latestValue={data?.frontendVersion ?? null}
                loading={loading}
              />
              <TextBlock>
                Current version: {frontendVersion} (CoreQuery v
                {corequeryPackageVersion})
              </TextBlock>
              <AsyncFieldValue
                prefix="Latest version"
                value={
                  data == null
                    ? null
                    : `${data.frontendVersion} (CoreQuery v${data.corequeryPackageVersion})`
                }
                loading={loading}
              />
            </Column>
            {!loading &&
              data != null &&
              data?.frontendVersion !== frontendVersion && (
                <OutdatedPwaControls />
              )}
          </Column>
        )}
        <Divider />
        <Column class="gap-4">
          <ComparisonHeader
            header="Foundational data"
            currentValue={foda.hash}
            latestValue={data?.foundationalDataHash ?? null}
            loading={loading}
          />
          <TextBlock class="break-all">
            Current version: {foda.serverVersion} (hash: {foda.hash})
          </TextBlock>
          <AsyncFieldValue
            class="break-all"
            prefix="Latest version"
            value={
              data == null
                ? null
                : `${data.serverVersion} (hash: ${data.foundationalDataHash})`
            }
            loading={loading}
          />
        </Column>
        <Divider />
      </Column>
    </Page>
  );
}

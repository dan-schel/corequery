import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/header/use-simple-headers";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Divider } from "@/web/components/core/Divider";
import { Alert } from "@/web/components/Alert";
import { VERSIONS_V1 } from "@/shared/apis";
import { useQuery } from "@/web/hooks/api/use-query";
import { AppVersionSection } from "@/web/components/pages/debug/AppVersionSection";
import { FoundationalDataSection } from "@/web/components/pages/debug/FoundationalDataSection";
import { ServerVersionSection } from "@/web/components/pages/debug/ServerVersionSection";
import { StorageSection } from "@/web/components/pages/debug/StorageSection";

export default function Debug() {
  const { data, loading, error } = useQuery(VERSIONS_V1, {});

  return (
    <Page {...useSimpleHeaders({ title: "Developer info" })}>
      <Column class="px-4 py-8 gap-8">
        {error != null && (
          <Alert type="error">
            <TextBlock>
              An error occurred while fetching the latest version info from the
              server.
            </TextBlock>
          </Alert>
        )}
        <AppVersionSection
          latestVersion={data?.frontendVersion ?? null}
          loading={loading}
        />
        <Divider />
        <FoundationalDataSection
          latestVersion={data?.foundationalDataHash ?? null}
          loading={loading}
        />
        <Divider />
        <ServerVersionSection
          serverVersion={data?.serverVersion ?? null}
          corequeryPackageVersion={data?.corequeryPackageVersion ?? null}
          loading={loading}
          error={error}
        />
        <Divider />
        <StorageSection />
        <Divider />
      </Column>
    </Page>
  );
}

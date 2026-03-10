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
import { LoadingTextBlock } from "@/web/components/pages/debug/LoadingTextBlock";
import { ComparisonHeader } from "@/web/components/pages/debug/ComparisonHeader";

export default function Debug() {
  const { frontendVersion } = useStaticData();
  const foda = useFoundationalData();

  const { data, loading, error } = useQuery(
    VERSIONS_V1,
    {},
    { debugDelay: 2000, debugError: false },
  );

  return (
    <Page {...useSimpleHeaders({ title: "Developer info" })}>
      <Column class="px-4 py-8 gap-8 min-w-0">
        {error != null && (
          <Alert type="error">
            <TextBlock>
              Unable to fetch the latest version info from the server.
            </TextBlock>
          </Alert>
        )}
        <Column class="gap-4">
          <ComparisonHeader
            header="App version"
            currentValue={frontendVersion}
            latestValue={data?.version ?? null}
            loading={loading}
          />
          <TextBlock>Current version: {frontendVersion}</TextBlock>
          <LoadingTextBlock
            prefix="Latest version"
            value={data?.version ?? null}
            loading={loading}
          />
        </Column>
        <Divider />
        <Column class="gap-4">
          <ComparisonHeader
            header="Foundational data"
            currentValue={foda.hash}
            latestValue={data?.foundationalDataHash ?? null}
            loading={loading}
          />
          <TextBlock class="break-all">Current hash: {foda.hash}</TextBlock>
          <LoadingTextBlock
            class="break-all"
            prefix="Latest hash"
            value={data?.foundationalDataHash ?? null}
            loading={loading}
          />
        </Column>
        <Divider />
      </Column>
    </Page>
  );
}

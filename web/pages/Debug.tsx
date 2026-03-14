import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/use-simple-headers";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Divider } from "@/web/components/core/Divider";
import { Alert } from "@/web/components/Alert";
import { useVersionsApiResponse } from "@/web/components/pages/debug/use-versions-api-response";
import { AppVersionSection } from "@/web/components/pages/debug/AppVersionSection";
import { VersionsApiResponseProvider } from "@/web/components/pages/debug/VersionsApiResponseProvider";
import { FoundationalDataSection } from "@/web/components/pages/debug/FoundationalDataSection";

export default function Debug() {
  return (
    <Page {...useSimpleHeaders({ title: "Developer info" })}>
      <VersionsApiResponseProvider>
        <Column class="px-4 py-8 gap-8">
          <ErrorBanner />
          <AppVersionSection />
          <Divider />
          <FoundationalDataSection />
          <Divider />
        </Column>
      </VersionsApiResponseProvider>
    </Page>
  );
}

function ErrorBanner() {
  const { error } = useVersionsApiResponse();

  if (error == null) return null;

  return (
    <Alert type="error">
      <TextBlock>
        Unable to fetch the latest version info from the server.
      </TextBlock>
    </Alert>
  );
}

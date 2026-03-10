import { Column } from "@/web/components/core/Column";
import { useStaticData } from "@/web/data/static-data";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/use-simple-headers";
import { useQuery } from "@/web/utils/api";
import { VERSIONS_V1 } from "@/shared/apis";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Divider } from "@/web/components/core/Divider";
import { useFoundationalData } from "@/web/data/foundational-data/context";
import { TextPlaceholder } from "@/web/components/core/Placeholder";
import { Alert } from "@/web/components/Alert";
import { Row } from "@/web/components/core/Row";
import { Pill } from "@/web/components/Pill";
import { VerticalBleed } from "@/web/components/core/VerticalBleed";
import { getTextBoxHeightRem } from "@/web/components/core/TextBoxTrim";

export default function Debug() {
  const { frontendVersion } = useStaticData();
  const foda = useFoundationalData();
  const { data, loading, error } = useQuery(
    VERSIONS_V1,
    {},
    { debugDelay: 20000 },
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
          <Row class="gap-x-2 gap-y-3" wrap>
            <TextBlock style="strong">App version</TextBlock>
            {loading && <TextPlaceholder class="w-[20%] text-md" />}
            {!loading &&
              data != null &&
              (data.version === frontendVersion ? (
                <VerticalBleed heightRem={getTextBoxHeightRem("text-md")}>
                  <Pill type="success" text="Up to date" />
                </VerticalBleed>
              ) : (
                <VerticalBleed heightRem={getTextBoxHeightRem("text-md")}>
                  <Pill type="error" text="Outdated" />
                </VerticalBleed>
              ))}
          </Row>
          <TextBlock>Current version: {frontendVersion}</TextBlock>
          {loading && <TextPlaceholder class="w-[40%] text-md" />}
          {!loading && data != null && (
            <TextBlock>Latest version: {data.version}</TextBlock>
          )}
        </Column>
        <Divider />
        <Column class="gap-4">
          <Row class="gap-x-2 gap-y-3" wrap>
            <TextBlock style="strong">Foundational data</TextBlock>
            {loading && <TextPlaceholder class="w-[20%] text-md" />}
            {!loading &&
              data != null &&
              (data.foundationalDataHash === foda.hash ? (
                <VerticalBleed heightRem={getTextBoxHeightRem("text-md")}>
                  <Pill type="success" text="Up to date" />
                </VerticalBleed>
              ) : (
                <VerticalBleed heightRem={getTextBoxHeightRem("text-md")}>
                  <Pill type="error" text="Outdated" />
                </VerticalBleed>
              ))}
          </Row>
          <TextBlock class="break-all">Current hash: {foda.hash}</TextBlock>
          {loading && <TextPlaceholder class="w-[40%] text-md" />}
          {!loading && data != null && (
            <TextBlock class="break-all">
              Latest hash: {data.foundationalDataHash}
            </TextBlock>
          )}
        </Column>
        <Divider />
      </Column>
    </Page>
  );
}

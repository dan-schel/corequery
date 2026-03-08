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
import { Strong } from "@/web/components/core/Strong";
import { TrafficLight } from "@/web/components/TrafficLight";

export default function Debug() {
  const { frontendVersion } = useStaticData();
  const foda = useFoundationalData();
  const { data, loading, error } = useQuery(
    VERSIONS_V1,
    {},
    { debugDelay: 2000 },
  );

  return (
    <Page {...useSimpleHeaders({ title: "Developer info" })}>
      <Column class="px-4 py-8 gap-8 min-w-0">
        {error != null && (
          <TextBlock>
            An error occurred while fetching the latest version info from the
            server. <Strong>😢</Strong>
          </TextBlock>
        )}
        <Column class="gap-4">
          <TextBlock style="strong">App version</TextBlock>
          {loading && <TextPlaceholder class="w-[20%] text-md" />}
          {!loading &&
            data != null &&
            (data.version === frontendVersion ? (
              <TrafficLight color="green">
                <TextBlock>Up to date</TextBlock>
              </TrafficLight>
            ) : (
              <TrafficLight color="red">
                <TextBlock>Outdated</TextBlock>
              </TrafficLight>
            ))}
          <TextBlock>Current version: {frontendVersion}</TextBlock>
          {loading && <TextPlaceholder class="w-[40%] text-md" />}
          {!loading && data != null && (
            <TextBlock>Latest version: {data.version}</TextBlock>
          )}
        </Column>
        <Divider />
        <Column class="gap-4">
          <TextBlock style="strong">Foundational data</TextBlock>
          {loading && <TextPlaceholder class="w-[20%] text-md" />}
          {!loading &&
            data != null &&
            (data.foundationalDataHash === foda.hash ? (
              <TrafficLight color="green">
                <TextBlock>Up to date</TextBlock>
              </TrafficLight>
            ) : (
              <TrafficLight color="red">
                <TextBlock>Outdated</TextBlock>
              </TrafficLight>
            ))}
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

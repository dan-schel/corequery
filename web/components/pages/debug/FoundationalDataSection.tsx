import { Column } from "@/web/components/core/Column";
import { ComparisonHeader } from "@/web/components/pages/debug/ComparisonHeader";
import { useVersionsApiResponse } from "@/web/components/pages/debug/utils/use-versions-api-response";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { TextBlock } from "@/web/components/core/TextBlock";
import { AsyncFieldValue } from "@/web/components/pages/debug/AsyncFieldValue";
import clsx from "clsx";
import { trimIfHash } from "@/web/components/pages/debug/utils/trim-if-hash";

type FoundationalDataSectionProps = {
  class?: string;
};

export function FoundationalDataSection(props: FoundationalDataSectionProps) {
  const { data, loading } = useVersionsApiResponse();
  const { foda } = useFoundationalData();

  return (
    <Column class={clsx(props.class, "gap-6")}>
      <ComparisonHeader
        header="Foundational data"
        currentValue={foda.hash}
        latestValue={data?.foundationalDataHash ?? null}
        loading={loading}
      />
      <Column class="gap-4">
        <TextBlock>Current version: {trimIfHash(foda.hash)}</TextBlock>
        <TextBlock style="small-weak">
          Server version: {foda.serverVersion}
        </TextBlock>
      </Column>
      <AsyncFieldValue
        prefix="Latest version"
        value={trimIfHash(data?.foundationalDataHash)}
        loading={loading}
      />
    </Column>
  );
}

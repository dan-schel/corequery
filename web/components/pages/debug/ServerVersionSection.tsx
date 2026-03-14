import clsx from "clsx";
import { Column } from "@/web/components/core/Column";
import { TextBlock } from "@/web/components/core/TextBlock";
import { useVersionsApiResponse } from "@/web/components/pages/debug/utils/use-versions-api-response";
import { AsyncFieldValue } from "@/web/components/pages/debug/AsyncFieldValue";
import { trimIfHash } from "@/web/components/pages/debug/utils/trim-if-hash";

type ServerVersionSectionProps = {
  class?: string;
};

export function ServerVersionSection(props: ServerVersionSectionProps) {
  const { data, loading } = useVersionsApiResponse();

  return (
    <Column class={clsx(props.class, "gap-8")}>
      <Column class="gap-6">
        <TextBlock style="strong">Server</TextBlock>
        <Column class="gap-4">
          <AsyncFieldValue
            prefix="Server version"
            value={trimIfHash(data?.serverVersion)}
            loading={loading}
          />
          <AsyncFieldValue
            prefix="CoreQuery version"
            value={data?.corequeryPackageVersion ?? null}
            loading={loading}
          />
        </Column>
      </Column>
    </Column>
  );
}

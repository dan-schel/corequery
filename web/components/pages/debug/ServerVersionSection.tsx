import clsx from "clsx";
import { Column } from "@/web/components/core/Column";
import { TextBlock } from "@/web/components/core/TextBlock";
import { AsyncFieldValue } from "@/web/components/pages/debug/AsyncFieldValue";
import { trimIfHash } from "@/web/components/pages/debug/utils/trim-if-hash";
import { Alert } from "@/web/components/Alert";

type ServerVersionSectionProps = {
  class?: string;
  serverVersion: string | null;
  corequeryPackageVersion: string | null;
  loading: boolean;
  error: unknown;
};

export function ServerVersionSection(props: ServerVersionSectionProps) {
  return (
    <Column class={clsx(props.class, "gap-6")}>
      <TextBlock style="strong">Server</TextBlock>
      {props.error != null && (
        <Alert type="error">
          <TextBlock>
            An error occurred while fetching the latest version info from the
            server.
          </TextBlock>
        </Alert>
      )}
      <Column class="gap-4">
        <AsyncFieldValue
          prefix="Server version"
          value={trimIfHash(props.serverVersion)}
          loading={props.loading}
        />
        <AsyncFieldValue
          prefix="CoreQuery version"
          value={props.corequeryPackageVersion}
          loading={props.loading}
        />
      </Column>
    </Column>
  );
}

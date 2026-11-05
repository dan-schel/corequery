import clsx from "clsx";
import { Column } from "@/web/components/core/Column";
import { useEnvironment } from "@/web/hooks/use-environment";
import { useStaticData } from "@/web/hooks/use-static-data";
import { HeaderWithPill } from "@/web/components/pages/debug/HeaderWithPill";
import { TextBlock } from "@/web/components/core/TextBlock";
import { ComparisonHeader } from "@/web/components/pages/debug/ComparisonHeader";
import { AsyncFieldValue } from "@/web/components/pages/debug/AsyncFieldValue";
import { trimIfHash } from "@/web/components/pages/debug/utils/trim-if-hash";
import { OutdatedPwaControls } from "@/web/components/pages/debug/OutdatedPwaControls";

type AppVersionSectionProps = {
  class?: string;
  latestVersion: string | null;
  loading: boolean;
};

export function AppVersionSection(props: AppVersionSectionProps) {
  const { isHotReloadingEnabled } = useEnvironment();

  if (isHotReloadingEnabled) {
    return <HotReloadingModeContent {...props} />;
  } else {
    return <ProductionModeContent {...props} />;
  }
}

function HotReloadingModeContent(props: AppVersionSectionProps) {
  return (
    <Column class={clsx(props.class, "gap-6")}>
      <HeaderWithPill
        header="App version"
        pillContent={{ text: "Development", type: "info" }}
        loading={false}
      />
      <TextBlock>
        All frontend code is being served with hot-reloading enabled, not
        through the PWA. (The below values are meaningless.)
      </TextBlock>
      <CurrentVersions />
      <AsyncFieldValue
        prefix="Latest version"
        value={props.latestVersion?.slice(0, 8) ?? null}
        loading={props.loading}
      />
    </Column>
  );
}

function ProductionModeContent(props: AppVersionSectionProps) {
  const { frontendVersion } = useStaticData();

  const showOutdatedPwaControls =
    !props.loading &&
    props.latestVersion != null &&
    props.latestVersion !== frontendVersion;

  return (
    <Column class={clsx(props.class, "gap-6")}>
      <ComparisonHeader
        header="App version"
        currentValue={frontendVersion}
        latestValue={props.latestVersion}
        loading={props.loading}
      />
      <CurrentVersions />
      <AsyncFieldValue
        prefix="Latest version"
        value={trimIfHash(props.latestVersion)}
        loading={props.loading}
      />
      {showOutdatedPwaControls && <OutdatedPwaControls />}
    </Column>
  );
}

function CurrentVersions() {
  const { frontendVersion, versionsOnLastUpdate } = useStaticData();

  return (
    <Column class="gap-4">
      <TextBlock>Current version: {trimIfHash(frontendVersion)}</TextBlock>
      <Column class="gap-3">
        <TextBlock style="small-weak">
          Server version: {trimIfHash(versionsOnLastUpdate.serverVersion)}
        </TextBlock>
        <TextBlock style="small-weak">
          CoreQuery version: {versionsOnLastUpdate.corequeryPackageVersion}
        </TextBlock>
      </Column>
    </Column>
  );
}

import type { ComponentChildren } from "preact";
import clsx from "clsx";
import { Row } from "@/web/components/core/Row";
import { LoadingSpinner } from "@/web/components/LoadingSpinner";
import { TextBlock } from "@/web/components/core/TextBlock";
import { VerticalBleed } from "@/web/components/core/VerticalBleed";
import { getTextBoxHeightRem } from "@/web/components/core/TextBoxTrim";
import { Button } from "@/web/components/button/Button";
import { useServiceWorker } from "@/web/hooks/use-service-worker";
import { MingcuteRefresh3Line } from "@/web/components/icons/MingcuteRefresh3Line";

type OutdatedPwaControlsProps = {
  class?: string;
  children?: ComponentChildren;
};

export function OutdatedPwaControls(props: OutdatedPwaControlsProps) {
  const { isUpdateAvailable, update } = useServiceWorker();

  if (isUpdateAvailable) {
    return (
      <Button
        theme="accent"
        text="Refresh & update"
        class="self-start"
        icon={MingcuteRefresh3Line}
        onClick={() => void update()}
      />
    );
  }

  return (
    <Row class={clsx(props.class, "gap-2")}>
      <VerticalBleed heightRem={getTextBoxHeightRem("text-md")}>
        <LoadingSpinner />
      </VerticalBleed>
      <TextBlock class="min-w-0 shrink">
        Waiting for service worker to install update...
      </TextBlock>
    </Row>
  );
}

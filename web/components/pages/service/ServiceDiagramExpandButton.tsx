import { TextBlock } from "@/web/components/core/TextBlock";
import { Row } from "@/web/components/core/Row";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import type { FrontendServiceMovement } from "@/web/data/service/frontend-service-movement";
import { useMemo } from "preact/hooks";
import { HoverButtonHousing } from "@/web/components/button/housings/HoverButtonHousing";
import { VerticalBleed } from "@/web/components/core/VerticalBleed";
import { getTextBoxHeightRem } from "@/web/components/core/TextBoxTrim";
import { MingcuteChevronsUpDownLine } from "@/web/components/icons/MingcuteChevronsUpDownLine";
import clsx from "clsx";

type ServiceDiagramExpandButtonProps = {
  class?: string;
  movement: FrontendServiceMovement;
  onClick: () => void;
};

export function ServiceDiagramExpandButton(
  props: ServiceDiagramExpandButtonProps,
) {
  const { foda } = useFoundationalData();

  const stopData = foda.stops.require(props.movement.stopId);
  const scheduledTimeStr = useMemo(
    () => props.movement.getFormattedScheduledTime(foda.formatTimezone),
    [foda.formatTimezone, props.movement],
  );

  return (
    <HoverButtonHousing
      class={clsx(props.class, "-m-2 p-2")}
      onClick={props.onClick}
    >
      <Row yAlign="center">
        <TextBlock style="small" class="shrink">
          Originates at {stopData.name} at {scheduledTimeStr}
        </TextBlock>
        <TextBlock style="small-weak" class="bullet-margin">
          &bull;
        </TextBlock>
        <Row class="gap-1" yAlign="center">
          <TextBlock style="small-weak">Expand</TextBlock>
          <VerticalBleed heightRem={getTextBoxHeightRem("text-sm")}>
            <MingcuteChevronsUpDownLine class="text-fg-weak text-icon-md" />
          </VerticalBleed>
        </Row>
      </Row>
    </HoverButtonHousing>
  );
}

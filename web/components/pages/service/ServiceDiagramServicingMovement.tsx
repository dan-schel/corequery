import { TextBlock } from "@/web/components/core/TextBlock";
import { LinkText } from "@/web/components/core/LinkText";
import { CorequeryUrls } from "@/web/pages/corequery-urls";
import { Row } from "@/web/components/core/Row";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import type { FrontendServiceMovement } from "@/web/data/service/frontend-service-movement";
import { formatTime } from "@/web/data/time-formatting";
import { useMemo } from "preact/hooks";
import { Column } from "@/web/components/core/Column";
import { useTerminology } from "@/web/hooks/use-terminology";
import { getTextBoxHeightRem } from "@/web/components/core/TextBoxTrim";

type ServiceDiagramServicingMovementProps = {
  class?: string;
  movement: FrontendServiceMovement;
};

export const Y_MARK_POSITION = (getTextBoxHeightRem("text-md") * 16) / 2;

export function ServiceDiagramServicingMovement(
  props: ServiceDiagramServicingMovementProps,
) {
  const { foda } = useFoundationalData();
  const { formatPosition } = useTerminology();

  const stopData = foda.stops.require(props.movement.stopId);
  const url = CorequeryUrls.stop(stopData.urlPath);

  const positionStr = useMemo(() => {
    if (props.movement.positionId == null) return null;

    const position = foda.stops
      .require(props.movement.stopId)
      .positions.require(props.movement.positionId);

    return formatPosition(position.name);
  }, [foda, formatPosition, props.movement]);

  const timeStr = useMemo(() => {
    const instant = props.movement.servicePageTime.time;
    const plainTime = instant
      .toZonedDateTimeISO(foda.formatTimezone)
      .toPlainTime();
    return formatTime(plainTime);
  }, [foda, props.movement.servicePageTime.time]);

  // TODO: Show formerTime, timeType asterisks, wifi symbol, etc.

  return (
    <Column class="gap-3">
      <Row class="min-w-0">
        <TextBlock style="strong">
          <LinkText href={url} style="subtle">
            {stopData.name}
          </LinkText>
        </TextBlock>
        {positionStr != null && (
          <>
            <TextBlock class="bullet-margin">&bull;</TextBlock>
            <TextBlock class="shrink min-w-0" oneLine>
              {positionStr}
            </TextBlock>
          </>
        )}
      </Row>
      <Row class="min-w-0">
        <TextBlock class="shrink min-w-0" oneLine>
          {timeStr}
        </TextBlock>
      </Row>
    </Column>
  );
}

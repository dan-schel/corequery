import { TextBlock } from "@/web/components/core/TextBlock";
import { LinkText } from "@/web/components/core/LinkText";
import { CorequeryUrls } from "@/web/pages/corequery-urls";
import { Row } from "@/web/components/core/Row";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import type { FrontendServiceMovement } from "@/web/data/service/frontend-service-movement";
import { useMemo } from "preact/hooks";
import { Column } from "@/web/components/core/Column";
import { useTerminology } from "@/web/hooks/use-terminology";
import { getTextBoxHeightRem } from "@/web/components/core/TextBoxTrim";
import { useNow } from "@/web/hooks/use-now";
import { DelayText } from "@/web/components/service-times/DelayText";
import { DepartureTime } from "@/web/components/service-times/DepartureTime";

type ServiceDiagramServicingMovementProps = {
  class?: string;
  movement: FrontendServiceMovement;
  isCancelled: boolean;
};

export const Y_MARK_POSITION = (getTextBoxHeightRem("text-md") * 16) / 2;

export function ServiceDiagramServicingMovement(
  props: ServiceDiagramServicingMovementProps,
) {
  const { foda } = useFoundationalData();
  const { formatPosition } = useTerminology();
  const { currentMinute } = useNow();

  const stopData = foda.stops.require(props.movement.stopId);
  const url = CorequeryUrls.stop(stopData.urlPath);

  const positionStr = useMemo(() => {
    if (props.movement.positionId == null) return null;

    const position = foda.stops
      .require(props.movement.stopId)
      .positions.require(props.movement.positionId);

    return formatPosition(position.name);
  }, [foda, formatPosition, props.movement]);

  const timeStrings = useMemo(
    () =>
      props.movement.getTimeStrings(
        props.isCancelled,
        currentMinute,
        foda.formatTimezone,
      ),
    [currentMinute, foda.formatTimezone, props.movement, props.isCancelled],
  );

  // TODO: Show formerTime, timeType asterisks, wifi symbol, etc.

  return (
    <Column class="gap-3" xAlign="left">
      <Row class="min-w-0">
        <TextBlock style="strong">
          <LinkText href={url} style="subtle">
            {stopData.name}
          </LinkText>
        </TextBlock>

        <TextBlock class="bullet-margin">&bull;</TextBlock>
        <DepartureTime
          timeStrings={timeStrings}
          dynamicColor={null}
          style="service-page"
        />
      </Row>
      <Row class="min-w-0">
        {timeStrings.delay != null && <DelayText delay={timeStrings.delay} />}
        <TextBlock class="bullet-margin">&bull;</TextBlock>
        {positionStr != null && (
          <TextBlock class="shrink min-w-0" oneLine>
            {positionStr}
          </TextBlock>
        )}
      </Row>
    </Column>
  );
}

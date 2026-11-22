import { TextBlock } from "@/web/components/core/TextBlock";
import { LinkText } from "@/web/components/core/LinkText";
import { CorequeryUrls } from "@/web/pages/corequery-urls";
import { Row } from "@/web/components/core/Row";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import type { FrontendServiceMovement } from "@/web/data/service/frontend-service-movement";
import { useMemo } from "preact/hooks";
import { Column } from "@/web/components/core/Column";
import { useTerminology } from "@/web/hooks/use-terminology";
import { getTextBoxHeightPx } from "@/web/components/core/TextBoxTrim";
import { useNow } from "@/web/hooks/use-now";
import { ServiceDelayText } from "@/web/components/service-times/ServiceDelayText";
import { ServiceTimesText } from "@/web/components/service-times/ServiceTimesText";

type ServiceDiagramServicingMovementProps = {
  class?: string;
  movement: FrontendServiceMovement;
  isCancelled: boolean;
};

export const Y_MARK_POSITION = getTextBoxHeightPx("text-mdlg") / 2;

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

  const formattedTimes = useMemo(
    () =>
      props.movement.getFormattedTimes(
        props.isCancelled,
        currentMinute,
        foda.formatTimezone,
      ),
    [currentMinute, foda.formatTimezone, props.movement, props.isCancelled],
  );

  return (
    <Column class="gap-3" xAlign="left">
      <Row class="min-w-0">
        <TextBlock style="departure-headline-strong">
          <LinkText href={url} style="subtle">
            {stopData.name}
          </LinkText>
        </TextBlock>
        <TextBlock class="bullet-margin">&bull;</TextBlock>
        <ServiceTimesText
          style="service-page"
          times={formattedTimes}
          dynamicColor={null}
        />
      </Row>
      <Row class="min-w-0">
        {formattedTimes.delay != null && (
          <ServiceDelayText
            delay={formattedTimes.delay}
            showAsterisk={formattedTimes.showAsterisk}
          />
        )}
        {formattedTimes.delay != null && positionStr != null && (
          <TextBlock class="bullet-margin" style="departure-info">
            &bull;
          </TextBlock>
        )}
        {positionStr != null && (
          <TextBlock class="shrink min-w-0" style="departure-info" oneLine>
            {positionStr}
          </TextBlock>
        )}
      </Row>
    </Column>
  );
}

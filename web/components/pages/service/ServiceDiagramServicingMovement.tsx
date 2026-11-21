import { TextBlock } from "@/web/components/core/TextBlock";
import { LinkText } from "@/web/components/core/LinkText";
import { CorequeryUrls } from "@/web/pages/corequery-urls";
import { Row } from "@/web/components/core/Row";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import type { FrontendServiceMovement } from "@/web/data/service/frontend-service-movement";
import { formatTime } from "@/web/data/time-formatting";
import { useMemo } from "preact/hooks";

type ServiceDiagramServicingMovementProps = {
  class?: string;
  movement: FrontendServiceMovement;
};

export function ServiceDiagramServicingMovement(
  props: ServiceDiagramServicingMovementProps,
) {
  const { foda } = useFoundationalData();

  const stopData = foda.stops.require(props.movement.stopId);
  const url = CorequeryUrls.stop(stopData.urlPath);

  const timeStr = useMemo(() => {
    const instant = props.movement.servicePageTime.time;
    const plainTime = instant
      .toZonedDateTimeISO(foda.formatTimezone)
      .toPlainTime();
    return formatTime(plainTime);
  }, [foda.formatTimezone, props.movement.servicePageTime.time]);

  return (
    <Row class="gap-2 min-w-0">
      <TextBlock style="strong">
        <LinkText href={url} style="subtle">
          {stopData.name}
        </LinkText>
      </TextBlock>
      <TextBlock>&bull;</TextBlock>
      <TextBlock class="shrink min-w-0" oneLine>
        {timeStr}
      </TextBlock>
    </Row>
  );
}

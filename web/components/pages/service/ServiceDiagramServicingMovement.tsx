import { TextBlock } from "@/web/components/core/TextBlock";
import { LinkText } from "@/web/components/core/LinkText";
import { CorequeryUrls } from "@/web/pages/corequery-urls";
import { Row } from "@/web/components/core/Row";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import type { MovementData } from "@/web/components/pages/service/types";

type ServiceDiagramServicingMovementProps = {
  class?: string;
  movement: MovementData;
};

export function ServiceDiagramServicingMovement(
  props: ServiceDiagramServicingMovementProps,
) {
  const { foda } = useFoundationalData();

  const stopData = foda.stops.require(props.movement.stopId);
  const url = CorequeryUrls.stop(stopData.urlPath);

  const arrivalTime =
    props.movement.arrivalTime != null
      ? new Date(Date.parse(props.movement.arrivalTime)).toLocaleString()
      : null;

  const departureTime =
    props.movement.departureTime != null
      ? new Date(Date.parse(props.movement.departureTime)).toLocaleString()
      : null;

  const time = departureTime ?? arrivalTime;

  return (
    <Row class="gap-2 min-w-0">
      <TextBlock style="strong">
        <LinkText href={url} style="subtle">
          {stopData.name}
        </LinkText>
      </TextBlock>
      <TextBlock>&bull;</TextBlock>
      <TextBlock class="shrink min-w-0" oneLine>
        {time}
      </TextBlock>
    </Row>
  );
}

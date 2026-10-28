import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import type {
  MovementData,
  ServiceData,
} from "@/web/components/pages/service/types";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import type { LinearMapDiagramStructure } from "@/web/components/map-diagram/linear/types";
import { LinearMapDiagram } from "@/web/components/map-diagram/linear";
import { TextBlock } from "@/web/components/core/TextBlock";
import { LinkText } from "@/web/components/core/LinkText";
import { useMemo } from "preact/hooks";
import type { FoundationalData } from "@/web/data/foundational-data";
import { Row } from "@/web/components/core/Row";

type ServiceDiagramProps = {
  class?: string;
  service: ServiceData;
};

export function ServiceDiagram(props: ServiceDiagramProps) {
  const { foda } = useFoundationalData();

  const structure = useMemo<LinearMapDiagramStructure>(
    () => ({
      type: "linear",
      stops: buildStopStructures(foda, props.service.movements),
    }),
    [foda, props.service.movements],
  );

  return (
    <Grid class={clsx(props.class)}>
      <LinearMapDiagram
        class={props.class}
        structure={structure}
        lightThemeColorHexCode={props.service.color?.lightModeHexCode ?? null}
        darkThemeColorHexCode={props.service.color?.darkModeHexCode ?? null}
      />
    </Grid>
  );
}

export function buildStopStructures(
  foda: FoundationalData,
  movements: readonly MovementData[],
) {
  return movements.map((m) => {
    const stopData = foda.stops.require(m.stopId);

    // TODO: Standardize this with usePageSearch.
    const url = `/stop/${stopData.urlPath}`;

    const arrivalTime =
      m.arrivalTime != null
        ? new Date(Date.parse(m.arrivalTime)).toLocaleString()
        : null;

    const departureTime =
      m.departureTime != null
        ? new Date(Date.parse(m.departureTime)).toLocaleString()
        : null;

    if (arrivalTime == null && departureTime == null) {
      return {
        content: (
          <TextBlock style="small-weak">
            <LinkText href={url} style="subtle">
              Skips {stopData.name}
            </LinkText>
          </TextBlock>
        ),
        drawMark: false,
      };
    }

    const time = departureTime ?? arrivalTime;

    return {
      content: (
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
      ),
    };
  });
}

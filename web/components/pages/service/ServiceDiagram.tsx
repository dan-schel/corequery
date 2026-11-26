import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import type { LinearMapDiagramStructure } from "@/web/components/map-diagram/linear/types";
import { LinearMapDiagram } from "@/web/components/map-diagram/linear";
import { useMemo } from "preact/hooks";
import { ServiceDiagramPassingMovement } from "@/web/components/pages/service/ServiceDiagramPassingMovement";
import {
  ServiceDiagramServicingMovement,
  Y_MARK_POSITION,
} from "@/web/components/pages/service/ServiceDiagramServicingMovement";
import type { FrontendService } from "@/web/data/service/frontend-service";
import type { FrontendServiceMovement } from "@/web/data/service/frontend-service-movement";
import type { StopStructure } from "@/web/components/map-diagram/base/types";
import { TextBlock } from "@/web/components/core/TextBlock";

type ServiceDiagramProps = {
  class?: string;
  service: FrontendService;
  movementIndex: number;
};

export function ServiceDiagram(props: ServiceDiagramProps) {
  const structure = useMemo<LinearMapDiagramStructure>(
    () => ({
      type: "linear",
      stops: buildStopStructures(
        props.service.movements,
        props.service.isCancelled,
      ),
      continuingAboveContent: (
        <TextBlock style="skipped-stop">Has good vibes</TextBlock>
      ),
      continuingBelowContent: (
        <TextBlock style="skipped-stop">Has bad vibes</TextBlock>
      ),
      transparentUntilStopIndex: props.movementIndex,
    }),
    [props.service, props.movementIndex],
  );

  // TODO: Make it collapsable if movementIndex is greater than 2.

  return (
    <Grid class={clsx(props.class)}>
      <LinearMapDiagram
        class={props.class}
        structure={structure}
        lightThemeColorHexCode={props.service.color?.lightModeHexCode ?? null}
        darkThemeColorHexCode={props.service.color?.darkModeHexCode ?? null}
        spacing="loose"
      />
    </Grid>
  );
}

function buildStopStructures(
  movements: readonly FrontendServiceMovement[],
  isCancelled: boolean,
): StopStructure[] {
  return movements.map((m) => {
    if (m.isPassing) {
      return {
        content: <ServiceDiagramPassingMovement stopId={m.stopId} />,
        drawMark: false,
      };
    } else {
      return {
        content: (
          <ServiceDiagramServicingMovement
            movement={m}
            isCancelled={isCancelled}
          />
        ),
        getOverriddenMarkYPosition: () => Y_MARK_POSITION,
      };
    }
  });
}

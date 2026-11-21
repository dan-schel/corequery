import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import type { LinearMapDiagramStructure } from "@/web/components/map-diagram/linear/types";
import { LinearMapDiagram } from "@/web/components/map-diagram/linear";
import { useMemo } from "preact/hooks";
import { ServiceDiagramPassingMovement } from "@/web/components/pages/service/ServiceDiagramPassingMovement";
import { ServiceDiagramServicingMovement } from "@/web/components/pages/service/ServiceDiagramServicingMovement";
import type { FrontendService } from "@/web/data/service/frontend-service";
import type { FrontendServiceMovement } from "@/web/data/service/frontend-service-movement";

type ServiceDiagramProps = {
  class?: string;
  service: FrontendService;
};

export function ServiceDiagram(props: ServiceDiagramProps) {
  const structure = useMemo<LinearMapDiagramStructure>(
    () => ({
      type: "linear",
      stops: buildStopStructures(props.service.movements),
    }),
    [props.service.movements],
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

function buildStopStructures(movements: readonly FrontendServiceMovement[]) {
  return movements.map((m) => {
    if (m.arrivalTime == null && m.departureTime == null) {
      return {
        content: <ServiceDiagramPassingMovement stopId={m.stopId} />,
        drawMark: false,
      };
    } else {
      return {
        content: <ServiceDiagramServicingMovement movement={m} />,
      };
    }
  });
}

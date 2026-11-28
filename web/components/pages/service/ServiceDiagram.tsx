import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import type { LinearMapDiagramStructure } from "@/web/components/map-diagram/linear/types";
import { LinearMapDiagram } from "@/web/components/map-diagram/linear";
import { useCallback, useMemo, useState } from "preact/hooks";
import { ServiceDiagramPassingMovement } from "@/web/components/pages/service/ServiceDiagramPassingMovement";
import {
  ServiceDiagramServicingMovement,
  Y_MARK_POSITION,
} from "@/web/components/pages/service/ServiceDiagramServicingMovement";
import type { FrontendService } from "@/web/data/service/frontend-service";
import type { FrontendServiceMovement } from "@/web/data/service/frontend-service-movement";
import type { StopStructure } from "@/web/components/map-diagram/base/types";
import { ServiceDiagramCollapsedButton } from "@/web/components/pages/service/ServiceDiagramCollapsedButton";
import { itsOk } from "@dan-schel/js-utils";

type ServiceDiagramProps = {
  class?: string;
  service: FrontendService;
  movementIndex: number;
};

export function ServiceDiagram(props: ServiceDiagramProps) {
  const canCollapse = props.movementIndex > 2;
  const [collapsed, setCollapsed] = useState(canCollapse);

  const handleExpand = useCallback(() => setCollapsed(false), []);

  const structure = useMemo<LinearMapDiagramStructure>(() => {
    const allStops = buildStopStructures(
      props.service.movements,
      props.service.isCancelled,
    );

    if (collapsed) {
      const originatingMovement = itsOk(props.service.movements[0]);

      return {
        type: "linear",
        stops: allStops.slice(props.movementIndex),
        transparentUntilStopIndex: 0,
        continuingAboveContent: (
          <ServiceDiagramCollapsedButton
            onClick={handleExpand}
            movement={originatingMovement}
          />
        ),
      };
    }

    return {
      type: "linear",
      stops: allStops,
      transparentUntilStopIndex: props.movementIndex,
    };
  }, [props.service, props.movementIndex, collapsed, handleExpand]);

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

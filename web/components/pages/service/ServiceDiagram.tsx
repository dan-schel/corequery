import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import type { LinearMapDiagramStructure } from "@/web/components/map-diagram/linear/types";
import { LinearMapDiagram } from "@/web/components/map-diagram/linear";
import { useCallback, useMemo, useState } from "preact/hooks";
import { ServiceDiagramPassingMovement } from "@/web/components/pages/service/ServiceDiagramPassingMovement";
import {
  ServiceDiagramServicingMovement,
  Y_MARK_POSITION,
  Y_MARK_POSITION_WITH_COLLAPSE_BUTTON,
} from "@/web/components/pages/service/ServiceDiagramServicingMovement";
import type { FrontendService } from "@/web/data/service/frontend-service";
import type { FrontendServiceMovement } from "@/web/data/service/frontend-service-movement";
import type { StopStructure } from "@/web/components/map-diagram/base/types";
import { ServiceDiagramExpandButton } from "@/web/components/pages/service/ServiceDiagramExpandButton";
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
  const handleCollapse = useCallback(() => setCollapsed(true), []);

  const structure = useMemo<LinearMapDiagramStructure>(() => {
    const allStops = buildStopStructures(
      props.service.movements,
      props.service.isCancelled,
      canCollapse && !collapsed ? props.movementIndex : null,
      handleCollapse,
    );

    if (collapsed) {
      const originatingMovement = itsOk(props.service.movements[0]);

      return {
        type: "linear",
        stops: allStops.slice(props.movementIndex),
        transparentUntilStopIndex: 0,
        continuingAboveContent: (
          <ServiceDiagramExpandButton
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
  }, [
    props.service.movements,
    props.service.isCancelled,
    props.movementIndex,
    canCollapse,
    handleCollapse,
    collapsed,
    handleExpand,
  ]);

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
  indexWithCollapseButton: number | null,
  onCollapse: () => void,
): StopStructure[] {
  return movements.map((m, i) => {
    if (m.isPassing) {
      return {
        content: <ServiceDiagramPassingMovement stopId={m.stopId} />,
        drawMark: false,
      };
    } else {
      // The index with the collapse button can only be a servicing movement, as
      // it's either `null` or the `movementIndex` passed to the
      // <ServiceDiagram> component (i.e. the `?from=` index). The service page
      // displays an error if the `?from=` is a passing movement.
      const hasCollapseButton = i === indexWithCollapseButton;

      return {
        content: (
          <ServiceDiagramServicingMovement
            movement={m}
            isCancelled={isCancelled}
            onCollapse={hasCollapseButton ? onCollapse : undefined}
          />
        ),
        getOverriddenMarkYPosition: () =>
          hasCollapseButton
            ? Y_MARK_POSITION_WITH_COLLAPSE_BUTTON
            : Y_MARK_POSITION,
      };
    }
  });
}

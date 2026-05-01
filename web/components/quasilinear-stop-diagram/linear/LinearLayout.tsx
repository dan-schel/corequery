import type { LinearStopDiagramStructure } from "@/web/components/quasilinear-stop-diagram/structure-types";
import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import {
  Canvas,
  type CreateControllerFunc,
} from "@/web/components/canvas/Canvas";
import { useCallback, useMemo } from "preact/hooks";
import { useSettings } from "@/web/hooks/use-settings";
import type { QuasilinearStopDiagramCanvasData } from "@/web/components/quasilinear-stop-diagram/quasilinear-diagram-canvas-controller";
import { LinearDiagramCanvasController } from "@/web/components/quasilinear-stop-diagram/linear/linear-diagram-canvas-controller";
import { Column } from "@/web/components/core/Column";

export const STOPS_SECTION_CLASS = "_diagram-stops";

type LinearLayoutProps = {
  class?: string;
  structure: LinearStopDiagramStructure;
  lightThemeColorHexCode: string | null;
  darkThemeColorHexCode: string | null;
};

export function LinearLayout(props: LinearLayoutProps) {
  const { settings } = useSettings();

  const data = useMemo<QuasilinearStopDiagramCanvasData>(
    () => ({
      structure: props.structure,
      lightThemeColorHexCode: props.lightThemeColorHexCode,
      darkThemeColorHexCode: props.darkThemeColorHexCode,
      colorTheme: settings.theme,
    }),
    [
      props.darkThemeColorHexCode,
      props.lightThemeColorHexCode,
      props.structure,
      settings.theme,
    ],
  );

  const createController = useCallback<
    CreateControllerFunc<QuasilinearStopDiagramCanvasData>
  >(
    (canvasContainer, canvas) =>
      new LinearDiagramCanvasController(canvasContainer, canvas),
    [],
  );

  return (
    <Grid class={clsx(props.class, "grid-cols-[auto_1fr] gap-4")}>
      <Canvas<QuasilinearStopDiagramCanvasData>
        class="w-4"
        createController={createController}
        data={data}
      />
      <Column class={clsx("gap-6", STOPS_SECTION_CLASS)}>
        {props.structure.stops.map((stop) => (
          <Grid>{stop.content}</Grid>
        ))}
      </Column>
    </Grid>
  );
}

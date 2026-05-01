import type { RefObject } from "preact";
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

type LinearLayoutProps = {
  class?: string;
  structure: LinearStopDiagramStructure;
  lightThemeColorHexCode: string | null;
  darkThemeColorHexCode: string | null;
  contentParent: HTMLDivElement | null;
  contentParentRef: RefObject<HTMLDivElement>;
};

export function LinearLayout(props: LinearLayoutProps) {
  const { settings } = useSettings();

  const data = useMemo<QuasilinearStopDiagramCanvasData>(
    () => ({
      structure: props.structure,
      lightThemeColorHexCode: props.lightThemeColorHexCode,
      darkThemeColorHexCode: props.darkThemeColorHexCode,
      contentParent: props.contentParent,
      colorTheme: settings.theme,
    }),
    [
      props.darkThemeColorHexCode,
      props.contentParent,
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
      <div ref={props.contentParentRef} class="flex flex-col gap-6">
        {props.structure.stops.map((stop) => (
          <Grid>{stop.content}</Grid>
        ))}
      </div>
    </Grid>
  );
}

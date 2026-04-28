import clsx from "clsx";
import {
  Canvas,
  type CreateControllerFunc,
} from "@/web/components/canvas/Canvas";
import { useCallback, useMemo } from "preact/hooks";
import { useSettings } from "@/web/hooks/use-settings";
import type { QuasilinearStopDiagramStructure } from "@/web/components/quasilinear-stop-diagram/structure-types";
import {
  QuasilinearStopDiagramCanvasController,
  type QuasilinearStopDiagramCanvasData,
} from "@/web/components/quasilinear-stop-diagram/quasilinear-diagram-canvas-controller";

type QuasilinearStopDiagramCanvasProps = {
  class?: string;
  structure: QuasilinearStopDiagramStructure;
  lightThemeColorHexCode: string;
  darkThemeColorHexCode: string;
  labelsParent: HTMLDivElement | null;
};

export function QuasilinearStopDiagramCanvas(
  props: QuasilinearStopDiagramCanvasProps,
) {
  const { settings } = useSettings();

  const data = useMemo<QuasilinearStopDiagramCanvasData>(
    () => ({
      structure: props.structure,
      lightThemeColorHexCode: props.lightThemeColorHexCode,
      darkThemeColorHexCode: props.darkThemeColorHexCode,
      labelsParent: props.labelsParent,
      colorTheme: settings.theme,
    }),
    [
      props.darkThemeColorHexCode,
      props.labelsParent,
      props.lightThemeColorHexCode,
      props.structure,
      settings.theme,
    ],
  );

  const createController = useCallback<
    CreateControllerFunc<QuasilinearStopDiagramCanvasData>
  >(
    (canvasContainer, canvas) =>
      new QuasilinearStopDiagramCanvasController(canvasContainer, canvas),
    [],
  );

  return (
    <Canvas<QuasilinearStopDiagramCanvasData>
      class={clsx(props.class)}
      createController={createController}
      data={data}
    />
  );
}

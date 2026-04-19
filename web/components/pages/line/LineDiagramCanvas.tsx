import clsx from "clsx";
import {
  Canvas,
  type CreateControllerFunc,
} from "@/web/components/canvas/Canvas";
import { useCallback, useMemo } from "preact/hooks";
import type { FodaLineDiagramEntry } from "@/web/data/foundational-data/foda-line-collection";
import {
  LineDiagramCanvasController,
  type LineDiagramCanvasData,
} from "@/web/components/pages/line/line-diagram-canvas-controller";
import { useSettings } from "@/web/hooks/use-settings";

type LineDiagramCanvasProps = {
  class?: string;
  diagram: FodaLineDiagramEntry;
  labelsParent: HTMLDivElement | null;
};

export function LineDiagramCanvas(props: LineDiagramCanvasProps) {
  const { settings } = useSettings();

  const data = useMemo<LineDiagramCanvasData>(
    () => ({
      diagram: props.diagram,
      labelsParent: props.labelsParent,
      colorTheme: settings.theme,
    }),
    [props.diagram, props.labelsParent, settings.theme],
  );

  const createController = useCallback<
    CreateControllerFunc<LineDiagramCanvasData>
  >(
    (canvasContainer, canvas) =>
      new LineDiagramCanvasController(canvasContainer, canvas),
    [],
  );

  return (
    <Canvas<LineDiagramCanvasData>
      class={clsx(props.class)}
      createController={createController}
      data={data}
    />
  );
}

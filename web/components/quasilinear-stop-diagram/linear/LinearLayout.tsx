import type { LinearStopDiagramStructure } from "@/web/components/quasilinear-stop-diagram/structure-types";
import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import {
  Canvas,
  type CreateControllerFunc,
} from "@/web/components/canvas/Canvas";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import { useSettings } from "@/web/hooks/use-settings";
import type { QuasilinearStopDiagramCanvasData } from "@/web/components/quasilinear-stop-diagram/quasilinear-diagram-canvas-controller";
import { LinearDiagramCanvasController } from "@/web/components/quasilinear-stop-diagram/linear/linear-diagram-canvas-controller";

export const STOPS_SECTION_CLASS = "_diagram-stops";

type LinearLayoutProps = {
  class?: string;
  structure: LinearStopDiagramStructure;
  lightThemeColorHexCode: string | null;
  darkThemeColorHexCode: string | null;
};

export function LinearLayout(props: LinearLayoutProps) {
  const { settings } = useSettings();

  const contentParentRef = useRef<HTMLDivElement>(null);

  // Bit a hack, but if we pass the ref directly to
  // <Canvas>, it uses the initial value of `null` and
  // doesn't notice when the ref updates to the actual div element. It does
  // notice this change in state though.
  //
  // TODO: This hack doesn't work if the structure type changes without the
  // component being unmounted/remounted. I'm currently using a key to achieve
  // this, but it shouldn't be the code which USES this component that has to
  // deal with it. Can I find a better solution?
  const [contentParent, setContentParent] = useState<HTMLDivElement | null>(
    null,
  );

  useEffect(() => {
    setContentParent(contentParentRef.current);
  }, []);

  const data = useMemo<QuasilinearStopDiagramCanvasData>(
    () => ({
      structure: props.structure,
      lightThemeColorHexCode: props.lightThemeColorHexCode,
      darkThemeColorHexCode: props.darkThemeColorHexCode,
      contentParent,
      colorTheme: settings.theme,
    }),
    [
      contentParent,
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
      <div
        ref={contentParentRef}
        class={clsx("flex flex-col gap-6", STOPS_SECTION_CLASS)}
      >
        {props.structure.stops.map((stop) => (
          <Grid>{stop.content}</Grid>
        ))}
      </div>
    </Grid>
  );
}

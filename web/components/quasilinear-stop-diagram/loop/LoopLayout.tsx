import type { LoopStopDiagramStructure } from "@/web/components/quasilinear-stop-diagram/structure-types";
import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import { Column } from "@/web/components/core/Column";
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
import { LoopDiagramCanvasController } from "@/web/components/quasilinear-stop-diagram/loop/loop-diagram-canvas-controller";

export const MAIN_STOPS_SECTION_CLASS = "_diagram-main-stops";
export const LOOP_LEFT_STOPS_SECTION_CLASS = "_diagram-loop-left-stops";
export const LOOP_RIGHT_STOPS_SECTION_CLASS = "_diagram-loop-right-stops";

type LoopLayoutProps = {
  class?: string;
  structure: LoopStopDiagramStructure;
  lightThemeColorHexCode: string | null;
  darkThemeColorHexCode: string | null;
};

export function LoopLayout(props: LoopLayoutProps) {
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
      new LoopDiagramCanvasController(canvasContainer, canvas),
    [],
  );

  return (
    <div
      ref={contentParentRef}
      class={clsx(
        props.class,
        "grid grid-cols-[auto_auto_auto] grid-rows-[auto_auto] gap-x-4",
      )}
    >
      <Canvas<QuasilinearStopDiagramCanvasData>
        class="w-12 col-2 row-span-full"
        createController={createController}
        data={data}
      />
      <Column
        class={clsx("gap-6 col-1 row-1 py-4", LOOP_LEFT_STOPS_SECTION_CLASS)}
        xAlign="right"
        yAlign="center"
      >
        {props.structure.loopLeftStops.map((stop) => (
          <Grid>{stop.content}</Grid>
        ))}
      </Column>
      <Column
        class={clsx("gap-6 col-3 row-1 py-4", LOOP_RIGHT_STOPS_SECTION_CLASS)}
        xAlign="left"
        yAlign="center"
      >
        {props.structure.loopRightStops.map((stop) => (
          <Grid>{stop.content}</Grid>
        ))}
      </Column>
      <Column
        class={clsx("gap-6 col-3 row-2 -ml-4", MAIN_STOPS_SECTION_CLASS, {
          "pt-4": props.structure.mainStops.length > 0,
        })}
        xAlign="left"
      >
        {props.structure.mainStops.map((stop) => (
          <Grid>{stop.content}</Grid>
        ))}
      </Column>
    </div>
  );
}

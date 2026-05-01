import type { LoopMapDiagramStructure } from "@/web/components/map-diagram/loop/types";
import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import { Column } from "@/web/components/core/Column";
import {
  Canvas,
  type CreateControllerFunc,
} from "@/web/components/canvas/Canvas";
import { useCallback, useMemo } from "preact/hooks";
import { useSettings } from "@/web/hooks/use-settings";
import type { BaseMapDiagramCanvasData } from "@/web/components/map-diagram/base/types";
import { LoopMapDiagramController } from "@/web/components/map-diagram/loop/controller";
import { MapDiagramError } from "@/web/components/map-diagram/base/Error";

export const MAIN_STOPS_SECTION_CLASS = "_diagram-main-stops";
export const LOOP_LEFT_STOPS_SECTION_CLASS = "_diagram-loop-left-stops";
export const LOOP_RIGHT_STOPS_SECTION_CLASS = "_diagram-loop-right-stops";

type LoopMapDiagramProps = {
  class?: string;
  structure: LoopMapDiagramStructure;
  lightThemeColorHexCode: string | null;
  darkThemeColorHexCode: string | null;
};

export function LoopMapDiagram(props: LoopMapDiagramProps) {
  const { settings } = useSettings();

  const data = useMemo<BaseMapDiagramCanvasData<LoopMapDiagramStructure>>(
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
    CreateControllerFunc<BaseMapDiagramCanvasData<LoopMapDiagramStructure>>
  >(
    (canvasContainer, canvas) =>
      new LoopMapDiagramController(canvasContainer, canvas),
    [],
  );

  const { loopLeftStops, loopRightStops } = data.structure;
  if (loopLeftStops.length + loopRightStops.length < 1) {
    return <MapDiagramError />;
  }

  return (
    <Grid
      class={clsx(
        props.class,
        "grid-cols-[auto_auto_auto] grid-rows-[auto_auto] gap-x-4",
      )}
    >
      <Canvas<BaseMapDiagramCanvasData<LoopMapDiagramStructure>>
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
    </Grid>
  );
}

import type { RefObject } from "preact";
import type { LoopStopDiagramStructure } from "@/web/components/quasilinear-stop-diagram/structure-types";
import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import { QuasilinearStopDiagramCanvas } from "@/web/components/quasilinear-stop-diagram/QuasilinearStopDiagramCanvas";
import { Column } from "@/web/components/core/Column";

export const MAIN_STOPS_SECTION_CLASS = "_diagram-main-stops";
export const LOOP_LEFT_STOPS_SECTION_CLASS = "_diagram-loop-left-stops";
export const LOOP_RIGHT_STOPS_SECTION_CLASS = "_diagram-loop-right-stops";

type LoopLayoutProps = {
  class?: string;
  structure: LoopStopDiagramStructure;
  lightThemeColorHexCode: string;
  darkThemeColorHexCode: string;
  contentParent: HTMLDivElement | null;
  contentParentRef: RefObject<HTMLDivElement>;
};

export function LoopLayout(props: LoopLayoutProps) {
  return (
    <div
      ref={props.contentParentRef}
      class={clsx(
        props.class,
        "grid grid-cols-[1fr_auto_1fr] grid-rows-[auto_auto] gap-y-8 gap-x-4",
      )}
    >
      <QuasilinearStopDiagramCanvas
        class="w-12 col-2 row-span-full"
        structure={props.structure}
        lightThemeColorHexCode={props.lightThemeColorHexCode}
        darkThemeColorHexCode={props.darkThemeColorHexCode}
        contentParent={props.contentParent}
      />
      <Column
        class={clsx("gap-6 col-1 row-1 mt-4", LOOP_LEFT_STOPS_SECTION_CLASS)}
        xAlign="right"
        yAlign="center"
      >
        {props.structure.loopLeftStops.map((stop) => (
          <Grid>{stop.content}</Grid>
        ))}
      </Column>
      <Column
        class={clsx("gap-6 col-3 row-1 mt-4", LOOP_RIGHT_STOPS_SECTION_CLASS)}
        xAlign="left"
        yAlign="center"
      >
        {props.structure.loopRightStops.map((stop) => (
          <Grid>{stop.content}</Grid>
        ))}
      </Column>
      <Column
        class={clsx("gap-6 col-3 row-2 -ml-4", MAIN_STOPS_SECTION_CLASS)}
        xAlign="left"
      >
        {props.structure.mainStops.map((stop) => (
          <Grid>{stop.content}</Grid>
        ))}
      </Column>
    </div>
  );
}

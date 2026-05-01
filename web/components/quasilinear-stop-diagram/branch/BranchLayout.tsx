import type { BranchStopDiagramStructure } from "@/web/components/quasilinear-stop-diagram/structure-types";
import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import { Column } from "@/web/components/core/Column";
import {
  Canvas,
  type CreateControllerFunc,
} from "@/web/components/canvas/Canvas";
import { useCallback, useMemo } from "preact/hooks";
import { useSettings } from "@/web/hooks/use-settings";
import type { QuasilinearStopDiagramCanvasData } from "@/web/components/quasilinear-stop-diagram/quasilinear-diagram-canvas-controller";
import { BranchDiagramCanvasController } from "@/web/components/quasilinear-stop-diagram/branch/branch-diagram-canvas-controller";

export const COMMON_STOPS_SECTION_CLASS = "_diagram-common-stops";
export const BRANCH_A_STOPS_SECTION_CLASS = "_diagram-branch-a-stops";
export const BRANCH_B_STOPS_SECTION_CLASS = "_diagram-branch-b-stops";

type BranchLayoutProps = {
  class?: string;
  structure: BranchStopDiagramStructure;
  lightThemeColorHexCode: string | null;
  darkThemeColorHexCode: string | null;
};

export function BranchLayout(props: BranchLayoutProps) {
  const { settings } = useSettings();

  const data = useMemo<
    QuasilinearStopDiagramCanvasData<BranchStopDiagramStructure>
  >(
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
    CreateControllerFunc<
      QuasilinearStopDiagramCanvasData<BranchStopDiagramStructure>
    >
  >(
    (canvasContainer, canvas) =>
      new BranchDiagramCanvasController(canvasContainer, canvas),
    [],
  );

  return (
    <Grid
      class={clsx(
        props.class,
        "grid-cols-[auto_auto_auto] grid-rows-[auto_auto] gap-y-8 gap-x-4",
      )}
    >
      <Canvas<QuasilinearStopDiagramCanvasData<BranchStopDiagramStructure>>
        class="w-12 col-2 row-span-full"
        createController={createController}
        data={data}
      />
      <Column
        class={clsx("gap-6 col-3 row-1 -ml-4", COMMON_STOPS_SECTION_CLASS)}
        xAlign="left"
      >
        {props.structure.commonStops.map((stop) => (
          <Grid>{stop.content}</Grid>
        ))}
      </Column>
      <Column
        class={clsx("gap-6 col-1 row-2", BRANCH_A_STOPS_SECTION_CLASS)}
        xAlign="right"
      >
        {props.structure.branchAStops.map((stop) => (
          <Grid>{stop.content}</Grid>
        ))}
      </Column>
      <Column
        class={clsx("gap-6 col-3 row-2", BRANCH_B_STOPS_SECTION_CLASS)}
        xAlign="left"
      >
        {props.structure.branchBStops.map((stop) => (
          <Grid>{stop.content}</Grid>
        ))}
      </Column>
    </Grid>
  );
}

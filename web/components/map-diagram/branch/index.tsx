import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import { Column } from "@/web/components/core/Column";
import {
  Canvas,
  type CreateControllerFunc,
} from "@/web/components/canvas/Canvas";
import { useCallback, useMemo } from "preact/hooks";
import { useSettings } from "@/web/hooks/use-settings";
import { BranchMapDiagramController } from "@/web/components/map-diagram/branch/controller";
import type { BranchMapDiagramStructure } from "@/web/components/map-diagram/branch/types";
import type { BaseMapDiagramCanvasData } from "@/web/components/map-diagram/base/types";
import { MapDiagramError } from "@/web/components/map-diagram/base/Error";

export const COMMON_STOPS_SECTION_CLASS = "_diagram-common-stops";
export const BRANCH_A_STOPS_SECTION_CLASS = "_diagram-branch-a-stops";
export const BRANCH_B_STOPS_SECTION_CLASS = "_diagram-branch-b-stops";

type BranchMapDiagramProps = {
  class?: string;
  structure: BranchMapDiagramStructure;
  lightThemeColorHexCode: string | null;
  darkThemeColorHexCode: string | null;
};

export function BranchMapDiagram(props: BranchMapDiagramProps) {
  const { settings } = useSettings();

  const data = useMemo<BaseMapDiagramCanvasData<BranchMapDiagramStructure>>(
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
    CreateControllerFunc<BaseMapDiagramCanvasData<BranchMapDiagramStructure>>
  >(
    (canvasContainer, canvas) =>
      new BranchMapDiagramController(canvasContainer, canvas),
    [],
  );

  if (
    data.structure.commonStops.length < 1 ||
    data.structure.branchAStops.length < 1 ||
    data.structure.branchBStops.length < 1
  ) {
    return <MapDiagramError />;
  }

  return (
    <Grid
      class={clsx(
        props.class,
        "grid-cols-[auto_auto_auto] grid-rows-[auto_auto] gap-y-8 gap-x-4",
      )}
    >
      <Canvas<BaseMapDiagramCanvasData<BranchMapDiagramStructure>>
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

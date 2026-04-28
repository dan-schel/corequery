import type { RefObject } from "preact";
import type { BranchStopDiagramStructure } from "@/web/components/quasilinear-stop-diagram/structure-types";
import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import { QuasilinearStopDiagramCanvas } from "@/web/components/quasilinear-stop-diagram/QuasilinearStopDiagramCanvas";
import { Column } from "@/web/components/core/Column";

export const COMMON_STOPS_SECTION_CLASS = "_diagram-common-stops";
export const BRANCH_A_STOPS_SECTION_CLASS = "_diagram-branch-a-stops";
export const BRANCH_B_STOPS_SECTION_CLASS = "_diagram-branch-b-stops";

type BranchLayoutProps = {
  class?: string;
  structure: BranchStopDiagramStructure;
  lightThemeColorHexCode: string;
  darkThemeColorHexCode: string;
  contentParent: HTMLDivElement | null;
  contentParentRef: RefObject<HTMLDivElement>;
};

export function BranchLayout(props: BranchLayoutProps) {
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
    </div>
  );
}

import type { BranchStopDiagramStructure } from "@/web/components/quasilinear-stop-diagram/structure-types";
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
      new BranchDiagramCanvasController(canvasContainer, canvas),
    [],
  );

  return (
    <div
      ref={contentParentRef}
      class={clsx(
        props.class,
        "grid grid-cols-[auto_auto_auto] grid-rows-[auto_auto] gap-y-8 gap-x-4",
      )}
    >
      <Canvas<QuasilinearStopDiagramCanvasData>
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
    </div>
  );
}

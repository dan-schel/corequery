import type { QuasilinearStopDiagramStructure } from "@/web/components/quasilinear-stop-diagram/structure-types";
import { assertNever } from "@dan-schel/js-utils";
import { BranchLayout } from "@/web/components/quasilinear-stop-diagram/branch/BranchLayout";
import { LinearLayout } from "@/web/components/quasilinear-stop-diagram/linear/LinearLayout";
import { LoopLayout } from "@/web/components/quasilinear-stop-diagram/loop/LoopLayout";

type QuasilinearStopDiagramProps = {
  class?: string;
  structure: QuasilinearStopDiagramStructure;
  lightThemeColorHexCode: string | null;
  darkThemeColorHexCode: string | null;
};

export function QuasilinearStopDiagram(props: QuasilinearStopDiagramProps) {
  if (props.structure.type === "linear") {
    return (
      <LinearLayout
        class={props.class}
        structure={props.structure}
        lightThemeColorHexCode={props.lightThemeColorHexCode}
        darkThemeColorHexCode={props.darkThemeColorHexCode}
      />
    );
  } else if (props.structure.type === "branch") {
    return (
      <BranchLayout
        class={props.class}
        structure={props.structure}
        lightThemeColorHexCode={props.lightThemeColorHexCode}
        darkThemeColorHexCode={props.darkThemeColorHexCode}
      />
    );
  } else if (props.structure.type === "loop") {
    return (
      <LoopLayout
        class={props.class}
        structure={props.structure}
        lightThemeColorHexCode={props.lightThemeColorHexCode}
        darkThemeColorHexCode={props.darkThemeColorHexCode}
      />
    );
  } else {
    assertNever(props.structure);
  }
}

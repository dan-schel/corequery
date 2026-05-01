import { useEffect, useRef, useState } from "preact/hooks";
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

  if (props.structure.type === "linear") {
    return (
      <LinearLayout
        class={props.class}
        structure={props.structure}
        lightThemeColorHexCode={props.lightThemeColorHexCode}
        darkThemeColorHexCode={props.darkThemeColorHexCode}
        contentParent={contentParent}
        contentParentRef={contentParentRef}
      />
    );
  } else if (props.structure.type === "branch") {
    return (
      <BranchLayout
        class={props.class}
        structure={props.structure}
        lightThemeColorHexCode={props.lightThemeColorHexCode}
        darkThemeColorHexCode={props.darkThemeColorHexCode}
        contentParent={contentParent}
        contentParentRef={contentParentRef}
      />
    );
  } else if (props.structure.type === "loop") {
    return (
      <LoopLayout
        class={props.class}
        structure={props.structure}
        lightThemeColorHexCode={props.lightThemeColorHexCode}
        darkThemeColorHexCode={props.darkThemeColorHexCode}
        contentParent={contentParent}
        contentParentRef={contentParentRef}
      />
    );
  } else {
    assertNever(props.structure);
  }
}

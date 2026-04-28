import { useEffect, useRef, useState } from "preact/hooks";
import type { QuasilinearStopDiagramStructure } from "@/web/components/quasilinear-stop-diagram/structure-types";
import { assertNever } from "@dan-schel/js-utils";
import { LinearLayout } from "@/web/components/quasilinear-stop-diagram/layout/LinearLayout";
import { BranchLayout } from "@/web/components/quasilinear-stop-diagram/layout/BranchLayout";

type QuasilinearStopDiagramProps = {
  class?: string;
  structure: QuasilinearStopDiagramStructure;
  lightThemeColorHexCode: string;
  darkThemeColorHexCode: string;
};

export function QuasilinearStopDiagram(props: QuasilinearStopDiagramProps) {
  const contentParentRef = useRef<HTMLDivElement>(null);

  // Bit a hack, but if we pass the ref directly to
  // <QuasilinearStopDiagramCanvas>, it uses the initial value of `null` and
  // doesn't notice when the ref updates to the actual div element. It does
  // notice this change in state though.
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
  } else {
    assertNever(props.structure);
  }
}

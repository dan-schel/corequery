import type { RefObject } from "preact";
import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import { QuasilinearStopDiagramCanvas } from "@/web/components/quasilinear-stop-diagram/QuasilinearStopDiagramCanvas";
import { useEffect, useRef, useState } from "preact/hooks";
import type {
  LinearStopDiagramStructure,
  QuasilinearStopDiagramStructure,
} from "@/web/components/quasilinear-stop-diagram/structure-types";

type QuasilinearStopDiagramProps = {
  class?: string;
  structure: QuasilinearStopDiagramStructure;
  lightThemeColorHexCode: string;
  darkThemeColorHexCode: string;
};

export function QuasilinearStopDiagram(props: QuasilinearStopDiagramProps) {
  const labelsParentRef = useRef<HTMLDivElement>(null);

  // Bit a hack, but if we pass the ref directly to
  // <QuasilinearStopDiagramCanvas>, it uses the initial value of `null` and
  // doesn't notice when the ref updates to the actual div element. It does
  // notice this change in state though.
  const [labelsParent, setLabelsParent] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    setLabelsParent(labelsParentRef.current);
  }, []);

  if (props.structure.type === "linear") {
    return (
      <LinearLayout
        class={props.class}
        structure={props.structure}
        lightThemeColorHexCode={props.lightThemeColorHexCode}
        darkThemeColorHexCode={props.darkThemeColorHexCode}
        labelsParent={labelsParent}
        labelsParentRef={labelsParentRef}
      />
    );
  }
}

type LinearLayoutProps = {
  class?: string;
  structure: LinearStopDiagramStructure;
  lightThemeColorHexCode: string;
  darkThemeColorHexCode: string;
  labelsParent: HTMLDivElement | null;
  labelsParentRef: RefObject<HTMLDivElement>;
};

function LinearLayout(props: LinearLayoutProps) {
  return (
    <Grid class={clsx(props.class, "grid-cols-[auto_1fr] gap-4")}>
      <QuasilinearStopDiagramCanvas
        class="w-4"
        structure={props.structure}
        lightThemeColorHexCode={props.lightThemeColorHexCode}
        darkThemeColorHexCode={props.darkThemeColorHexCode}
        labelsParent={props.labelsParent}
      />
      <div ref={props.labelsParentRef} class="flex flex-col gap-6">
        {props.structure.stops.map((stop) => (
          <Grid>{stop.content}</Grid>
        ))}
      </div>
    </Grid>
  );
}

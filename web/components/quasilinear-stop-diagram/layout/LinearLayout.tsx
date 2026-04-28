import type { RefObject } from "preact";
import type { LinearStopDiagramStructure } from "@/web/components/quasilinear-stop-diagram/structure-types";
import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import { QuasilinearStopDiagramCanvas } from "@/web/components/quasilinear-stop-diagram/QuasilinearStopDiagramCanvas";

type LinearLayoutProps = {
  class?: string;
  structure: LinearStopDiagramStructure;
  lightThemeColorHexCode: string;
  darkThemeColorHexCode: string;
  contentParent: HTMLDivElement | null;
  contentParentRef: RefObject<HTMLDivElement>;
};

export function LinearLayout(props: LinearLayoutProps) {
  return (
    <Grid class={clsx(props.class, "grid-cols-[auto_1fr] gap-4")}>
      <QuasilinearStopDiagramCanvas
        class="w-4"
        structure={props.structure}
        lightThemeColorHexCode={props.lightThemeColorHexCode}
        darkThemeColorHexCode={props.darkThemeColorHexCode}
        contentParent={props.contentParent}
      />
      <div ref={props.contentParentRef} class="flex flex-col gap-6">
        {props.structure.stops.map((stop) => (
          <Grid>{stop.content}</Grid>
        ))}
      </div>
    </Grid>
  );
}

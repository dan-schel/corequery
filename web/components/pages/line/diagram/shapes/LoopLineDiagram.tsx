import { useMemo } from "preact/hooks";
import type { FodaLineDiagramEntry } from "@/web/data/foundational-data/foda-line-collection";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { LoopMapDiagram } from "@/web/components/map-diagram/loop/LoopLayout";
import { buildStopStructures } from "@/web/components/pages/line/diagram/utils/build-stop-structures";
import type { LoopStopDiagramStructure } from "@/web/components/map-diagram/loop/types";

type LoopLineDiagramProps = {
  class?: string;
  diagram: Extract<FodaLineDiagramEntry, { type: "loop" }>;
};

export function LoopLineDiagram(props: LoopLineDiagramProps) {
  const { foda } = useFoundationalData();

  const structure = useMemo<LoopStopDiagramStructure>(
    () => ({
      type: "loop",
      loopLeftStops: buildStopStructures(foda, props.diagram.loopLeftStops),
      loopRightStops: buildStopStructures(foda, props.diagram.loopRightStops),
      mainStops: buildStopStructures(foda, props.diagram.mainStops),
    }),
    [foda, props.diagram],
  );

  return (
    <LoopMapDiagram
      class={props.class}
      structure={structure}
      lightThemeColorHexCode={props.diagram.color?.lightModeHexCode ?? null}
      darkThemeColorHexCode={props.diagram.color?.darkModeHexCode ?? null}
    />
  );
}

import { useMemo } from "preact/hooks";
import type { FodaLineDiagramEntry } from "@/web/data/foundational-data/foda-line-collection";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { BranchMapDiagram } from "@/web/components/map-diagram/branch/BranchLayout";
import { buildStopStructures } from "@/web/components/pages/line/diagram/utils/build-stop-structures";
import type { BranchStopDiagramStructure } from "@/web/components/map-diagram/branch/types";

type BranchLineDiagramProps = {
  class?: string;
  diagram: Extract<FodaLineDiagramEntry, { type: "branch" }>;
};

export function BranchLineDiagram(props: BranchLineDiagramProps) {
  const { foda } = useFoundationalData();

  const structure = useMemo<BranchStopDiagramStructure>(
    () => ({
      type: "branch",
      commonStops: buildStopStructures(foda, props.diagram.commonStops),
      branchAStops: buildStopStructures(foda, props.diagram.branchAStops),
      branchBStops: buildStopStructures(foda, props.diagram.branchBStops),
    }),
    [foda, props.diagram],
  );

  return (
    <BranchMapDiagram
      class={props.class}
      structure={structure}
      lightThemeColorHexCode={props.diagram.color?.lightModeHexCode ?? null}
      darkThemeColorHexCode={props.diagram.color?.darkModeHexCode ?? null}
    />
  );
}

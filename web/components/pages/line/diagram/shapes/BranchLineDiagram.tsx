import { useMemo } from "preact/hooks";
import type { FodaLineDiagramEntry } from "@/web/data/foundational-data/foda-line-collection";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { BranchLayout } from "@/web/components/quasilinear-stop-diagram/branch/BranchLayout";
import type { BranchStopDiagramStructure } from "@/web/components/quasilinear-stop-diagram/structure-types";
import { buildStopStructures } from "@/web/components/pages/line/diagram/utils/build-stop-structures";

type BranchLineDiagramProps = {
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
    <BranchLayout
      structure={structure}
      lightThemeColorHexCode={props.diagram.color?.lightModeHexCode ?? null}
      darkThemeColorHexCode={props.diagram.color?.darkModeHexCode ?? null}
    />
  );
}

import type { FodaLineDiagramEntry } from "@/web/data/foundational-data/foda-line-collection";
import { useMemo } from "preact/hooks";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { LinearLayout } from "@/web/components/quasilinear-stop-diagram/linear/LinearLayout";
import type { LinearStopDiagramStructure } from "@/web/components/quasilinear-stop-diagram/structure-types";
import { buildStopStructures } from "@/web/components/pages/line/utils/build-stop-structures";

type LinearLineDiagramProps = {
  diagram: Extract<FodaLineDiagramEntry, { type: "linear" }>;
};

export function LinearLineDiagram(props: LinearLineDiagramProps) {
  const { foda } = useFoundationalData();

  const structure = useMemo<LinearStopDiagramStructure>(
    () => ({
      type: "linear",
      stops: buildStopStructures(foda, props.diagram.stops),
    }),
    [foda, props.diagram.stops],
  );

  return (
    <LinearLayout
      structure={structure}
      lightThemeColorHexCode={props.diagram.color?.lightModeHexCode ?? null}
      darkThemeColorHexCode={props.diagram.color?.darkModeHexCode ?? null}
    />
  );
}

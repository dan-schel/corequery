import type { FodaLineDiagramEntry } from "@/web/data/foundational-data/foda-line-collection";
import { useMemo } from "preact/hooks";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { LinearMapDiagram } from "@/web/components/map-diagram/linear";
import { buildStopStructures } from "@/web/components/pages/line/diagram/utils/build-stop-structures";
import type { LinearMapDiagramStructure } from "@/web/components/map-diagram/linear/types";

type LinearLineDiagramProps = {
  class?: string;
  diagram: Extract<FodaLineDiagramEntry, { type: "linear" }>;
};

export function LinearLineDiagram(props: LinearLineDiagramProps) {
  const { foda } = useFoundationalData();

  const structure = useMemo<LinearMapDiagramStructure>(
    () => ({
      type: "linear",
      stops: buildStopStructures(foda, props.diagram.stops),
    }),
    [foda, props.diagram.stops],
  );

  return (
    <LinearMapDiagram
      class={props.class}
      structure={structure}
      lightThemeColorHexCode={props.diagram.color?.lightModeHexCode ?? null}
      darkThemeColorHexCode={props.diagram.color?.darkModeHexCode ?? null}
    />
  );
}

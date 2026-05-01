import clsx from "clsx";
import type { FodaLineDiagramEntry } from "@/web/data/foundational-data/foda-line-collection";
import { Grid } from "@/web/components/core/Grid";
import { assertNever } from "@dan-schel/js-utils";
import { LinearLineDiagram } from "@/web/components/pages/line/diagram/shapes/LinearLineDiagram";
import { BranchLineDiagram } from "@/web/components/pages/line/diagram/shapes/BranchLineDiagram";
import { LoopLineDiagram } from "@/web/components/pages/line/diagram/shapes/LoopLineDiagram";

type LineDiagramViewerProps = {
  class?: string;
  diagram: FodaLineDiagramEntry;
};

export function LineDiagramViewer(props: LineDiagramViewerProps) {
  return (
    <Grid
      class={clsx(
        props.class,
        "bg-bg-raised px-4 py-8 justify-center rounded-sm border border-soft-border",
      )}
    >
      <Content diagram={props.diagram} />
    </Grid>
  );
}

function Content(props: { diagram: FodaLineDiagramEntry }) {
  if (props.diagram.type === "linear") {
    return <LinearLineDiagram diagram={props.diagram} />;
  } else if (props.diagram.type === "branch") {
    return <BranchLineDiagram diagram={props.diagram} />;
  } else if (props.diagram.type === "loop") {
    return <LoopLineDiagram diagram={props.diagram} />;
  } else {
    assertNever(props.diagram);
  }
}

import clsx from "clsx";
import type { FodaLineDiagramEntry } from "@/web/data/foundational-data/foda-line-collection";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { Grid } from "@/web/components/core/Grid";
import { useMemo } from "preact/hooks";
import { TextBlock } from "@/web/components/core/TextBlock";
import { LinkText } from "@/web/components/core/LinkText";
import { QuasilinearStopDiagram } from "@/web/components/quasilinear-stop-diagram/QuasilinearStopDiagram";
import type {
  QuasilinearStopDiagramStructure,
  StopStructure,
} from "@/web/components/quasilinear-stop-diagram/structure-types";
import type { FoundationalData } from "@/web/data/foundational-data";
import { assertNever } from "@dan-schel/js-utils";
import type z from "zod";
import type { lineDiagramStopFodaSchema } from "@/shared/apis/foundational-data/v1/foundational-data";

type LineDiagramViewerProps = {
  class?: string;
  diagram: FodaLineDiagramEntry;
};

export function LineDiagramViewer(props: LineDiagramViewerProps) {
  const { foda } = useFoundationalData();

  const structure = useMemo<QuasilinearStopDiagramStructure>(
    () => toStructure(foda, props.diagram),
    [foda, props.diagram],
  );

  return (
    <Grid
      class={clsx(
        props.class,
        "bg-bg-raised px-4 py-8 justify-center rounded-sm border border-soft-border",
      )}
    >
      <QuasilinearStopDiagram
        structure={structure}
        lightThemeColorHexCode={props.diagram.color?.lightModeHexCode ?? null}
        darkThemeColorHexCode={props.diagram.color?.darkModeHexCode ?? null}
      />
    </Grid>
  );
}

function toStructure(
  foda: FoundationalData,
  diagram: FodaLineDiagramEntry,
): QuasilinearStopDiagramStructure {
  function toStopStructures(
    stops: readonly z.infer<typeof lineDiagramStopFodaSchema>[],
  ) {
    return stops.map((stop) => toStopStructure(foda, stop.stopId, stop.type));
  }

  if (diagram.type === "linear") {
    return {
      type: "linear",
      stops: toStopStructures(diagram.stops),
    };
  } else if (diagram.type === "branch") {
    return {
      type: "branch",
      commonStops: toStopStructures(diagram.commonStops),
      branchAStops: toStopStructures(diagram.branchAStops),
      branchBStops: toStopStructures(diagram.branchBStops),
    };
  } else if (diagram.type === "loop") {
    return {
      type: "loop",
      loopLeftStops: toStopStructures(diagram.loopLeftStops),
      loopRightStops: toStopStructures(diagram.loopRightStops),
      mainStops: toStopStructures(diagram.mainStops),
    };
  } else {
    assertNever(diagram);
  }
}

function toStopStructure(
  foda: FoundationalData,
  stopId: number,
  type: "regular" | "always-express",
): StopStructure {
  const stopData = foda.stops.require(stopId);

  // TODO: Standardize this with usePageSearch.
  const url = `/stop/${stopData.urlPath}`;

  if (type === "regular") {
    return {
      content: (
        <TextBlock style="strong">
          <LinkText href={url} style="subtle">
            {stopData.name}
          </LinkText>
        </TextBlock>
      ),
    };
  } else if (type === "always-express") {
    return {
      content: (
        <TextBlock style="small-weak">
          <LinkText href={url} style="subtle">
            Skips {stopData.name}
          </LinkText>
        </TextBlock>
      ),
      drawMark: false,
    };
  } else {
    assertNever(type);
  }
}

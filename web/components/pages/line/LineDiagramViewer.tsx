import clsx from "clsx";
import type { FodaLineDiagramEntry } from "@/web/data/foundational-data/foda-line-collection";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { Grid } from "@/web/components/core/Grid";
import { useMemo } from "preact/hooks";
import { TextBlock } from "@/web/components/core/TextBlock";
import { LinkText } from "@/web/components/core/LinkText";
import { QuasilinearStopDiagram } from "@/web/components/quasilinear-stop-diagram/QuasilinearStopDiagram";
import type { QuasilinearStopDiagramStructure } from "@/web/components/quasilinear-stop-diagram/structure-types";
import type { FoundationalData } from "@/web/data/foundational-data";

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
  return {
    type: "linear",
    stops: diagram.stops.map((stop) => {
      const stopData = foda.stops.require(stop.stopId);

      // TODO: Standardize this with usePageSearch.
      const url = `/stop/${stopData.urlPath}`;

      return {
        content:
          stop.type === "always-express" ? (
            <TextBlock style="small-weak">
              <LinkText href={url} style="subtle">
                Skips {stopData.name}
              </LinkText>
            </TextBlock>
          ) : (
            <TextBlock style="strong">
              <LinkText href={url} style="subtle">
                {stopData.name}
              </LinkText>
            </TextBlock>
          ),
      };
    }),
  };
}

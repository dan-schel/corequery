import clsx from "clsx";
import { Column } from "@/web/components/core/Column";
import { LineDiagramCanvas } from "@/web/components/pages/line/LineDiagramCanvas";
import type { FodaLineDiagramEntry } from "@/web/data/foundational-data/foda-line-collection";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { Grid } from "@/web/components/core/Grid";
import { useMemo } from "preact/hooks";
import { TextBlock } from "@/web/components/core/TextBlock";
import { LinkText } from "@/web/components/core/LinkText";

type LineDiagramViewerProps = {
  class?: string;
  diagram: FodaLineDiagramEntry;
};

export function LineDiagramViewer(props: LineDiagramViewerProps) {
  const { foda } = useFoundationalData();

  const stops = useMemo(
    () =>
      props.diagram.stops.map(({ stopId, type }) => {
        const stop = foda.stops.require(stopId);

        return {
          name: stop.name,
          // TODO: Standardize this with usePageSearch.
          url: `/stop/${stop.urlPath}`,
          type,
        };
      }),
    [foda.stops, props.diagram.stops],
  );

  return (
    <Grid class={clsx(props.class)}>
      <LineDiagramCanvas diagram={props.diagram} />
      <Column class="gap-6">
        {stops.map((stop) =>
          stop.type === "always-express" ? (
            <TextBlock style="small-weak">Skips {stop.name}</TextBlock>
          ) : (
            <TextBlock style="strong">
              <LinkText href={stop.url} style="subtle">
                {stop.name}
              </LinkText>
            </TextBlock>
          ),
        )}
      </Column>
    </Grid>
  );
}

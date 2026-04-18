import clsx from "clsx";
import { LineDiagramCanvas } from "@/web/components/pages/line/LineDiagramCanvas";
import type { FodaLineDiagramEntry } from "@/web/data/foundational-data/foda-line-collection";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { Grid } from "@/web/components/core/Grid";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { TextBlock } from "@/web/components/core/TextBlock";
import { LinkText } from "@/web/components/core/LinkText";

type LineDiagramViewerProps = {
  class?: string;
  diagram: FodaLineDiagramEntry;
};

export function LineDiagramViewer(props: LineDiagramViewerProps) {
  const { foda } = useFoundationalData();

  const labelsParent = useRef<HTMLDivElement>(null);

  // Bit a hack, but if we pass the ref directly to <LineDiagramCanvas>, it uses
  // the initial value of null and doesn't notice when the ref updates to the
  // actual div element. It does notice this change in state though.
  const [labelsParentState, setLabelsParentState] =
    useState<HTMLDivElement | null>(null);
  useEffect(() => {
    setLabelsParentState(labelsParent.current);
  }, []);

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
    <Grid class={clsx(props.class, "relative")}>
      <Grid class="absolute top-0 bottom-0 left-0 w-8">
        <LineDiagramCanvas
          diagram={props.diagram}
          labelsParent={labelsParentState}
        />
      </Grid>
      <div ref={labelsParent} class="flex flex-col gap-6 ml-8">
        {stops.map((stop) =>
          stop.type === "always-express" ? (
            <TextBlock style="small-weak">
              <LinkText href={stop.url} style="subtle">
                Skips {stop.name}
              </LinkText>
            </TextBlock>
          ) : (
            <TextBlock style="strong">
              <LinkText href={stop.url} style="subtle">
                {stop.name}
              </LinkText>
            </TextBlock>
          ),
        )}
      </div>
    </Grid>
  );
}

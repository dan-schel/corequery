import clsx from "clsx";
import { Column } from "@/web/components/core/Column";
import { TextBlock } from "@/web/components/core/TextBlock";
import { useMemo } from "preact/hooks";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import type { FodaLine } from "@/web/data/foundational-data/foda-line-collection";

type LineDiagramSectionProps = {
  class?: string;
  diagram: FodaLine["diagram"];
};

export function LineDiagramSection(props: LineDiagramSectionProps) {
  const { foda } = useFoundationalData();

  const sortedStops = useMemo(() => {
    return props.diagram.fallbackStopList
      .map((stopId) => foda.stops.require(stopId))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [foda.stops, props.diagram.fallbackStopList]);

  return (
    <Column class={clsx(props.class, "gap-8")}>
      <TextBlock style="subtitle">Stops</TextBlock>
      <Column class="gap-4">
        {sortedStops.map((stop) => (
          <TextBlock key={stop.id}>{stop.name}</TextBlock>
        ))}
      </Column>
    </Column>
  );
}

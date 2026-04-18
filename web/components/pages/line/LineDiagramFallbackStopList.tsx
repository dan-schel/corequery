import type { ComponentChildren } from "preact";
import clsx from "clsx";
import { useMemo } from "preact/hooks";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { Column } from "@/web/components/core/Column";
import { TextBlock } from "@/web/components/core/TextBlock";

type LineDiagramFallbackStopListProps = {
  class?: string;
  children?: ComponentChildren;
  fallbackStopList: readonly number[];
};

export function LineDiagramFallbackStopList(
  props: LineDiagramFallbackStopListProps,
) {
  const { foda } = useFoundationalData();

  const sortedStops = useMemo(() => {
    return props.fallbackStopList
      .map((stopId) => foda.stops.require(stopId))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [foda.stops, props.fallbackStopList]);

  // TODO: Use a <ul> for this.
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

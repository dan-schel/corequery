import clsx from "clsx";
import { Column } from "@/web/components/core/Column";
import { TextBlock } from "@/web/components/core/TextBlock";
import type z from "zod";
import type { fodaSchema } from "@/shared/apis/foundational-data/v1/foundational-data";
import { useMemo } from "preact/hooks";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { nonNull } from "@dan-schel/js-utils";

type LineDiagramSectionProps = {
  class?: string;
  diagram: z.infer<typeof fodaSchema>["lines"][number]["diagram"];
};

export function LineDiagramSection(props: LineDiagramSectionProps) {
  const { foda } = useFoundationalData();

  const sortedStops = useMemo(() => {
    return props.diagram.fallbackStopList
      .map((stopId) => foda.stops.find((stop) => stop.id === stopId) ?? null)
      .filter(nonNull)
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

import clsx from "clsx";
import { Column } from "@/web/components/core/Column";
import { TextBlock } from "@/web/components/core/TextBlock";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { useMemo } from "preact/hooks";
import { useTerminology } from "@/web/hooks/use-terminology";

type DeparturePlatformIndicatorProps = {
  class?: string;
  stopId: number;
  positionId: number | null;
};

export function DeparturePositionIndicator(
  props: DeparturePlatformIndicatorProps,
) {
  const { foda } = useFoundationalData();
  const { positionIndicatorHeader } = useTerminology();

  const name = useMemo(() => {
    if (props.positionId == null) return null;

    const stop = foda.stops.require(props.stopId);
    const position = stop.positions.require(props.positionId);
    return position.name;
  }, [foda, props.stopId, props.positionId]);

  if (name == null) return null;

  return (
    <Column
      yAlign="space-between"
      class={clsx(
        props.class,
        "border-2 px-1.5 py-1 border-soft-border rounded-sm h-8.5 min-w-10",
      )}
    >
      <TextBlock style="tiny-narrow" align="center">
        {positionIndicatorHeader}
      </TextBlock>
      <TextBlock style="strong" align="center">
        {name}
      </TextBlock>
    </Column>
  );
}

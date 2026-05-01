import clsx from "clsx";
import { Column } from "@/web/components/core/Column";
import { TextBlock } from "@/web/components/core/TextBlock";
import { MingcuteAlertLine } from "@/web/components/icons/MingcuteAlertLine";

type MapDiagramErrorProps = {
  class?: string;
};

export function MapDiagramError(props: MapDiagramErrorProps) {
  return (
    <Column class={clsx(props.class, "gap-2")} xAlign="center">
      <MingcuteAlertLine class="text-icon-xl text-fg" />
      <TextBlock align="center">
        An error occurred rendering this diagram.
      </TextBlock>
    </Column>
  );
}

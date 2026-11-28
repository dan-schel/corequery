import { TextBlock } from "@/web/components/core/TextBlock";
import { Row } from "@/web/components/core/Row";
import { HoverButtonHousing } from "@/web/components/button/housings/HoverButtonHousing";
import { VerticalBleed } from "@/web/components/core/VerticalBleed";
import {
  getTextBoxHeightPx,
  getTextBoxHeightRem,
} from "@/web/components/core/TextBoxTrim";
import { MingcuteChevronsUpDownLine } from "@/web/components/icons/MingcuteChevronsUpDownLine";
import clsx from "clsx";

type ServiceDiagramCollapseButtonProps = {
  class?: string;
  onClick: () => void;
};

export const COLLAPSE_BUTTON_HEIGHT_PX = getTextBoxHeightPx("text-sm");

export function ServiceDiagramCollapseButton(
  props: ServiceDiagramCollapseButtonProps,
) {
  return (
    <HoverButtonHousing
      class={clsx(props.class, "-m-2 p-2")}
      onClick={props.onClick}
    >
      <Row class="gap-1" yAlign="center">
        <TextBlock style="small-weak" class="shrink">
          Collapse previous stops
        </TextBlock>
        <VerticalBleed heightRem={getTextBoxHeightRem("text-sm")}>
          <MingcuteChevronsUpDownLine class="text-fg-weak text-icon-md" />
        </VerticalBleed>
      </Row>
    </HoverButtonHousing>
  );
}

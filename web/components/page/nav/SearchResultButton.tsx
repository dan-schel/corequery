import type { ComponentChildren } from "preact";
import clsx from "clsx";
import { HoverSquareButtonHousing } from "@/web/components/button/housings/HoverSquareButtonHousing";
import type { Icon } from "@/web/components/icons/type";
import { Row } from "@/web/components/core/Row";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { VerticalBleed } from "@/web/components/core/VerticalBleed";
import { getTextBoxHeightRem } from "@/web/components/core/TextBoxTrim";

type SearchResultButtonProps = {
  class?: string;
  icon: Icon;
  title: string;
  description: ComponentChildren | null;
  href: string;
  onHrefClick: () => void;
};

export function SearchResultButton(props: SearchResultButtonProps) {
  return (
    <HoverSquareButtonHousing
      href={props.href}
      onHrefClick={props.onHrefClick}
      class={clsx(props.class)}
    >
      <Row
        class={clsx(props.class, "gap-2 min-w-0 py-3 px-3 min-h-10")}
        yAlign="center"
      >
        <VerticalBleed heightRem={getTextBoxHeightRem("text-md")}>
          <props.icon class="text-fg text-icon-lg" />
        </VerticalBleed>
        <Column class="gap-2 shrink">
          <TextBlock style="strong">{props.title}</TextBlock>
          {props.description}
        </Column>
      </Row>
    </HoverSquareButtonHousing>
  );
}

import type { ComponentChildren } from "preact";
import type { Icon } from "@/web/components/icons/type";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Row } from "@/web/components/core/Row";
import { HoverButtonHousing } from "@/web/components/button/housings/HoverButtonHousing";

type DesktopNavButtonProps = {
  class?: string;
  onClick?: () => void;
  href?: string;
  regularIcon: Icon;
  activeIcon: Icon;
  text: ComponentChildren;
  active?: boolean;
};

export function DesktopNavButton(props: DesktopNavButtonProps) {
  const active = props.active ?? false;

  return (
    <HoverButtonHousing
      class={props.class}
      onClick={props.onClick}
      href={props.href}
    >
      <Row class="gap-1" xAlign="center" yAlign="center">
        {active === true ? (
          <props.activeIcon class="text-accent-text text-xl" />
        ) : (
          <props.regularIcon class="text-fg text-xl" />
        )}
        <TextBlock style={active ? "small-accent" : "small"}>
          {props.text}
        </TextBlock>
      </Row>
    </HoverButtonHousing>
  );
}

import type { ComponentChildren } from "preact";
import type { Icon } from "@/web/components/icons/type";
import { Clickable } from "@/web/components/core/Clickable";
import { TextBlock } from "@/web/components/core/TextBlock";
import clsx from "clsx";
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
    <Clickable
      class={clsx(props.class, "group")}
      onClick={props.onClick}
      href={props.href}
    >
      <HoverButtonHousing>
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
    </Clickable>
  );
}

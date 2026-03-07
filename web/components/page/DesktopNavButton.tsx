import type { ComponentChildren } from "preact";
import type { Icon } from "@/web/components/icons/type";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Row } from "@/web/components/core/Row";
import clsx from "clsx";
import { HoverSquareButtonHousing } from "@/web/components/button/housings/HoverSquareButtonHousing";
import { Grid } from "@/web/components/core/Grid";

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
    <HoverSquareButtonHousing
      class={props.class}
      onClick={props.onClick}
      href={props.href}
    >
      <Row
        class={clsx("px-4 gap-2 border-y-2 border-y-transparent", {
          "border-b-accent": active,
        })}
        xAlign="center"
        yAlign="center"
      >
        {active === true ? (
          <props.activeIcon class="text-fg-strong text-lg" />
        ) : (
          <props.regularIcon class="text-fg text-lg" />
        )}
        <Grid class="relative">
          <TextBlock
            class={clsx("absolute left-0 right-0", {
              hidden: active,
            })}
            style="regular"
            align="center"
          >
            {props.text}
          </TextBlock>
          <TextBlock class={clsx({ invisible: !active })} style="strong">
            {props.text}
          </TextBlock>
        </Grid>
      </Row>
    </HoverSquareButtonHousing>
  );
}

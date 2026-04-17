import type { ComponentChildren } from "preact";
import type { Icon } from "@/web/components/icons/type";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Row } from "@/web/components/core/Row";
import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import { HoverButtonHousing } from "@/web/components/button/housings/HoverButtonHousing";

type DesktopNavButtonProps = {
  class?: string;
  onClick?: () => void;
  href?: string;
  regularIcon: Icon;
  activeIcon: Icon;
  text: ComponentChildren;
  active?: boolean;
  showBadge?: boolean;
};

export function DesktopNavButton(props: DesktopNavButtonProps) {
  const active = props.active ?? false;

  return (
    <Grid
      class={clsx(props.class, "border-y-2 border-y-transparent items-center", {
        "border-b-accent": active,
      })}
    >
      <HoverButtonHousing
        class={props.class}
        onClick={props.onClick}
        href={props.href}
      >
        <Row class="px-4 gap-2 h-8" xAlign="center" yAlign="center">
          <Grid class="relative">
            {(props.showBadge ?? false) && (
              <div class="h-2 w-2 absolute rounded-full bg-accent top-0 right-0" />
            )}
            {active === true ? (
              <props.activeIcon class="text-fg-strong text-icon-lg" />
            ) : (
              <props.regularIcon class="text-fg text-icon-lg" />
            )}
          </Grid>
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
      </HoverButtonHousing>
    </Grid>
  );
}

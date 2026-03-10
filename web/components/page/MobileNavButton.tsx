import type { ComponentChildren } from "preact";
import type { Icon } from "@/web/components/icons/type";
import { Clickable } from "@/web/components/core/Clickable";
import { Column } from "@/web/components/core/Column";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Grid } from "@/web/components/core/Grid";
import clsx from "clsx";

type MobileNavButtonProps = {
  class?: string;
  onClick?: () => void;
  href?: string;
  regularIcon: Icon;
  activeIcon: Icon;
  text: ComponentChildren;
  active?: boolean;
  showBadge?: boolean;
};

export function MobileNavButton(props: MobileNavButtonProps) {
  const active = props.active ?? false;

  return (
    <Clickable
      class={clsx(props.class, "group")}
      onClick={props.onClick}
      href={props.href}
    >
      <Column class="gap-1 pb-1.5" xAlign="center" yAlign="center">
        <Grid
          class={clsx("px-3 py-1 rounded-full relative", {
            "bg-soft-accent": active,
            "group-hover:bg-soft": !active,
            "group-active:bg-soft-active": !active,
          })}
        >
          {(props.showBadge ?? false) && (
            <div class="h-2 w-2 absolute rounded-full bg-accent top-1 right-3" />
          )}
          {active === true ? (
            <props.activeIcon class="text-accent-text text-xl" />
          ) : (
            <props.regularIcon class="text-fg text-xl" />
          )}
        </Grid>
        <TextBlock style={active ? "small-strong-accent" : "small"}>
          {props.text}
        </TextBlock>
      </Column>
    </Clickable>
  );
}

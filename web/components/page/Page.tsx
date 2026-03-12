import type { ComponentChildren } from "preact";
import { useNavExemptions } from "@/web/components/page/use-nav-exemptions";
import { Grid } from "@/web/components/core/Grid";
import clsx from "clsx";
import { MobileHeader } from "@/web/components/page/MobileHeader";
import { DesktopHeader } from "@/web/components/page/DesktopHeader";
import { PageCenterer } from "@/web/components/page/PageCenterer";

type PageProps = {
  class?: string;
  children?: ComponentChildren;
  mobileHeader: ComponentChildren | null;
  desktopHeader: ComponentChildren | null;
  centered?: boolean;
};

export function Page(props: PageProps) {
  const { showMobileNav } = useNavExemptions();
  const centered = props.centered ?? true;

  return (
    <Grid
      class={clsx(
        "bg-bg min-h-svh",
        {
          "pt-12": props.mobileHeader != null,

          // Matches the height of the <MobileNav>.
          "not-desktop:pb-18": showMobileNav,

          // If we're mounting a desktop header, we'll need to make a row for it.
          "desktop:grid-rows-[auto_1fr]": props.desktopHeader != null,
        },

        // Matches the height of the <DesktopNav>.
        "desktop:pt-12",
      )}
    >
      {props.mobileHeader != null && (
        // Mobile header is intentionally fixed at 3rem tall. If the page wants a
        // larger header they'll have to configure it through this component so it
        // can set the appropriate amount of padding.
        <MobileHeader class="h-12">{props.mobileHeader}</MobileHeader>
      )}
      {props.desktopHeader != null && (
        // Desktop header is not fixed (it scrolls with the page, so can be as
        // tall as it wants).
        <DesktopHeader>{props.desktopHeader}</DesktopHeader>
      )}
      {centered ? (
        <PageCenterer>{props.children}</PageCenterer>
      ) : (
        props.children
      )}
    </Grid>
  );
}

import type { ComponentChildren } from "preact";
import { useNavExemptions } from "@/web/components/page/use-nav-exemptions";
import { Grid } from "@/web/components/core/Grid";
import clsx from "clsx";
import { DesktopHeader } from "@/web/components/page/header/DesktopHeader";
import { PageCenterer } from "@/web/components/page/PageCenterer";
import { MobileHeader } from "@/web/components/page/header/MobileHeader";
import { Column } from "@/web/components/core/Column";

type PageProps = {
  class?: string;
  children?: ComponentChildren;
  mobileHeader?: ComponentChildren | null;
  desktopHeader?: ComponentChildren | null;
  agnosticHeader?: ComponentChildren | null;
  hideMobileHeaderWhenScrolledToTop?: boolean;
  centered?: boolean;
};

export function Page(props: PageProps) {
  const { showMobileNav } = useNavExemptions();
  const centered = props.centered ?? true;
  const hideMobileHeaderWhenScrolledToTop =
    props.hideMobileHeaderWhenScrolledToTop ?? false;

  return (
    <Column
      class={clsx(
        "bg-bg min-h-svh relative",
        {
          "pt-14":
            props.mobileHeader != null && !hideMobileHeaderWhenScrolledToTop,

          // Matches the height of the <MobileNav>.
          "not-desktop:pb-18": showMobileNav,

          // If we're mounting a desktop header, we'll need to make a row for it.
          "desktop:grid-rows-[auto_1fr]": props.desktopHeader != null,
        },

        // Matches the height of the <DesktopNav>.
        "desktop:pt-12",
      )}
    >
      {props.desktopHeader != null && (
        // Desktop header is not fixed (it scrolls with the page, so can be as
        // tall as it wants).
        <DesktopHeader class="z-0">{props.desktopHeader}</DesktopHeader>
      )}
      {props.mobileHeader != null && (
        // Intentionally lock the height at 3.5rem, so that if a page wanted to
        // use a taller header, they'd need to negotiate with the <Page>
        // component, and then we'd adjust the pt-14 above to match.
        <MobileHeader
          class="h-14 z-1"
          hideWhenScrolledToTop={hideMobileHeaderWhenScrolledToTop}
        >
          {props.mobileHeader}
        </MobileHeader>
      )}
      {props.agnosticHeader != null && (
        <Grid class="z-0">{props.agnosticHeader}</Grid>
      )}
      <Grid class="z-0 grow">
        {centered ? (
          <PageCenterer>{props.children}</PageCenterer>
        ) : (
          props.children
        )}
      </Grid>
    </Column>
  );
}

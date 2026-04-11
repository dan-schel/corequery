import type { ComponentChildren } from "preact";
import { useNavExemptions } from "@/web/components/page/use-nav-exemptions";
import { Grid } from "@/web/components/core/Grid";
import clsx from "clsx";
import { DesktopHeader } from "@/web/components/page/DesktopHeader";
import { PageCenterer } from "@/web/components/page/PageCenterer";
import { useSetMobileHeader } from "@/web/components/page/use-mobile-header";

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

  // The mobile header is rendered by PageContainer (fixed to the top of the
  // page, above the search panel). Pass the content up via context.
  useSetMobileHeader(props.mobileHeader);

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

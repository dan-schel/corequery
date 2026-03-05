import type { ComponentChildren } from "preact";
import { useNavExemptions } from "@/web/components/page/nav-exemptions";
import { Grid } from "@/web/components/core/Grid";
import clsx from "clsx";
import { MobileHeader } from "@/web/components/page/MobileHeader";

type PageProps = {
  class?: string;
  children?: ComponentChildren;

  // TODO: Make a separate one for desktop, in case the page wants to configure
  // them differently. Most pages will probably want something consistent across
  // both, so maybe some sort of useSharedHeader() hook which creates and
  // returns components for both types would be useful for the child pages to
  // have.
  mobileHeaderContent: ComponentChildren | null;
};

export function Page(props: PageProps) {
  const { showMobileNav } = useNavExemptions();

  // Mobile header is intentionally fixed at 3rem tall. If the page wants a
  // larger header they'll have to configure it through this component so it
  // can set the appropriate amount of padding.
  return (
    <Grid
      class={clsx("bg-bg min-h-svh", {
        "pt-12": props.mobileHeaderContent != null,

        // Matches the height of a MobileNavButton.
        "pb-18": showMobileNav,
      })}
    >
      {props.mobileHeaderContent != null && (
        <MobileHeader class="h-12">{props.mobileHeaderContent}</MobileHeader>
      )}
      {props.children}
    </Grid>
  );
}

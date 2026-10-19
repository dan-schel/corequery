import { type ComponentChildren } from "preact";
import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import { useEffect, useState } from "preact/hooks";

type MobileHeaderProps = {
  class?: string;
  children?: ComponentChildren;
  hideWhenScrolledToTop: boolean;
};

const scrollHideThresholdPx = 32;

export function MobileHeader(props: MobileHeaderProps) {
  const [collapsed, setCollapsed] = useState(
    window.scrollY < scrollHideThresholdPx,
  );

  useEffect(() => {
    function onScrollChanged() {
      setCollapsed(window.scrollY < scrollHideThresholdPx);
    }

    document.addEventListener("scroll", onScrollChanged);

    return () => {
      document.removeEventListener("scroll", onScrollChanged);
    };
  }, []);

  return (
    <Grid
      class={clsx(
        props.class,
        "fixed top-0 left-0 right-0 bg-bg-navbar border-b border-soft-border desktop:hidden transition-opacity duration-200",
        {
          "opacity-0": props.hideWhenScrolledToTop && collapsed,
        },
      )}
    >
      {props.children}
    </Grid>
  );
}

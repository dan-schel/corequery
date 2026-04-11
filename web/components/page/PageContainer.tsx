import type { ComponentChildren } from "preact";
import { Nav } from "@/web/components/page/Nav";
import { MobileHeader } from "@/web/components/page/MobileHeader";
import {
  MobileHeaderProvider,
  useMobileHeader,
  useMobileHeaderState,
} from "@/web/components/page/use-mobile-header";

type PageContainerProps = {
  class?: string;
  children?: ComponentChildren;
};

export function PageContainer(props: PageContainerProps) {
  const mobileHeaderState = useMobileHeaderState();

  return (
    <MobileHeaderProvider value={mobileHeaderState}>
      <PageContainerInner class={props.class}>
        {props.children}
      </PageContainerInner>
    </MobileHeaderProvider>
  );
}

function PageContainerInner(props: PageContainerProps) {
  const mobileHeader = useMobileHeader();

  return (
    <div class={props.class}>
      <div class="relative z-0">{props.children}</div>
      <div class="relative z-1">
        {mobileHeader != null && (
          // Mobile header is intentionally fixed at 3rem tall. If the page wants
          // a larger header they'll have to configure it through this component
          // so it can set the appropriate amount of padding.
          <MobileHeader class="h-12 z-10">{mobileHeader}</MobileHeader>
        )}
        <Nav />
      </div>
    </div>
  );
}

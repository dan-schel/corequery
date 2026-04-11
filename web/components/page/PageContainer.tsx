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
        <Nav />
      </div>
      <div class="relative z-2">
        {mobileHeader != null && (
          <MobileHeader class="h-12">{mobileHeader}</MobileHeader>
        )}
      </div>
    </div>
  );
}

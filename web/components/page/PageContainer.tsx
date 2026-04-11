import type { ComponentChildren } from "preact";
import { Nav } from "@/web/components/page/Nav";
import {
  MobileHeaderProvider,
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
      <div class={props.class}>
        <div class="relative z-0">{props.children}</div>
        <div class="relative z-1">
          <Nav />
        </div>
      </div>
    </MobileHeaderProvider>
  );
}

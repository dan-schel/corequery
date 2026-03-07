import type { ComponentChildren } from "preact";
import { MobileNav } from "@/web/components/page/MobileNav";
import { useNavExemptions } from "@/web/components/page/use-nav-exemptions";
import { DesktopNav } from "@/web/components/page/DesktopNav";

type PageContainerProps = {
  class?: string;
  children?: ComponentChildren;
};

export function PageContainer(props: PageContainerProps) {
  const { showMobileNav, showDesktopNav } = useNavExemptions();

  return (
    <div class={props.class}>
      <div class="relative z-0">{props.children}</div>
      <div class="relative z-1">
        {showMobileNav && <MobileNav />}
        {showDesktopNav && <DesktopNav />}
      </div>
    </div>
  );
}

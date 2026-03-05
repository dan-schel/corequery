import type { ComponentChildren } from "preact";
import { MobileNav } from "@/web/components/page/MobileNav";
import { useNavExemptions } from "@/web/components/page/nav-exemptions";

type PageContainerProps = {
  class?: string;
  children?: ComponentChildren;
};

export function PageContainer(props: PageContainerProps) {
  const { showMobileNav } = useNavExemptions();

  return (
    <div>
      {props.children}
      {showMobileNav && <MobileNav />}
    </div>
  );
}

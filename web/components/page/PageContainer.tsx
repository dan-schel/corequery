import type { ComponentChildren } from "preact";
import { MobileNav } from "@/web/components/page/MobileNav";
import { useLocation } from "preact-iso";

type PageContainerProps = {
  class?: string;
  children?: ComponentChildren;
};

export function PageContainer(props: PageContainerProps) {
  const { url } = useLocation();

  return (
    <div>
      {props.children}
      {showMobileNav(url) && <MobileNav />}
    </div>
  );
}

function showMobileNav(_url: string) {
  // So far, all pages show the mobile nav. Here's where pages can be made
  // exempt. The reason it's done this way (instead of making each page in
  // charge of showing the mobile nav) is so the same mobile nav instance can be
  // shared across navigations without unmounting/remounting.
  return true;
}

import type { ComponentChildren } from "preact";
import { Nav } from "@/web/components/page/nav/Nav";

type PageContainerProps = {
  class?: string;
  children?: ComponentChildren;
};

export function PageContainer(props: PageContainerProps) {
  return (
    <div class={props.class}>
      <div class="relative z-0">{props.children}</div>
      <div class="relative z-1">
        <Nav />
      </div>
    </div>
  );
}

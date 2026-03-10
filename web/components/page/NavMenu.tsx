import { Column } from "@/web/components/core/Column";
import clsx from "clsx";
import { Button } from "@/web/components/button/Button";
import { useMenuItems } from "@/web/hooks/use-nav-items";
import { PageCenterer } from "@/web/components/page/PageCenterer";

type NavMenuProps = {
  class?: string;
  open: boolean;
  onClose: () => void;
};

export function NavMenu(props: NavMenuProps) {
  const menuItems = useMenuItems();

  // ------------------------------------
  //  🔍 Search stops, lines, pages
  // ------------------------------------
  //  Recent pages                    ↕️
  //  - 12:10 Southern Cross train    ⭐
  //  - 12:50 Southern Cross train    ⚫
  //  - Berwick station               ⚫
  //  - Southern Cross station        ⚫
  //  - 7:49 East Pakenham train      ⚫
  // ------------------------------------
  //  ℹ️ About
  //  ⚙️ Settings
  //  🧑‍💻 Developer info
  //  🛠️ Admin controls
  //  ✨ Zen mode
  // ------------------------------------
  return (
    <div
      class={clsx(
        props.class,
        "relative transition-[opacity,visibility,translate] duration-100",
        {
          "invisible": !props.open,
          "opacity-0": !props.open,
          "not-desktop:translate-y-4": !props.open,
          "desktop:-translate-y-4": !props.open,
        },
      )}
    >
      <div class="z-0 absolute top-0 bottom-0 left-0 right-0 bg-bg-raised desktop:border-b not-desktop:border-t border-soft-border opacity-95" />
      <PageCenterer>
        <Column class="relative z-1 py-2">
          {menuItems.map((item) => (
            <Button
              icon={item.icon}
              text={item.name}
              href={item.href}
              onHrefClick={props.onClose}
              theme="hover-square"
              layout="menu-item"
            />
          ))}
        </Column>
      </PageCenterer>
    </div>
  );
}

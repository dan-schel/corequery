import { Column } from "@/web/components/core/Column";
import { TextBlock } from "@/web/components/core/TextBlock";
import clsx from "clsx";
import { Button } from "@/web/components/button/Button";
import { menuItems } from "@/web/components/page/nav-items";
import { useLocation } from "preact-iso";
import { useCallback } from "preact/hooks";

type MobileNavMenuProps = {
  class?: string;
  open: boolean;
  onClose: () => void;
};

export function MobileNavMenu(props: MobileNavMenuProps) {
  const { route } = useLocation();
  const onClose = props.onClose;

  const handleNavigation = useCallback(
    (href: string) => {
      onClose();
      route(href);
    },
    [onClose, route],
  );

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
        "relative transition-[opacity,visibility,translate] duration-200",
        {
          "invisible": !props.open,
          "opacity-0": !props.open,
          "translate-y-2": !props.open,
        },
      )}
    >
      <div class="z-0 absolute top-0 bottom-0 left-0 right-0 bg-bg-raised border-t border-soft-border opacity-90" />
      <Column class="relative z-1 py-2">
        {menuItems.map((item) => (
          <Button
            icon={item.icon}
            text={item.name}
            onClick={() => handleNavigation(item.href)}
            theme="hover-square"
            layout="menu-item"
          />
        ))}
      </Column>
    </div>
  );
}

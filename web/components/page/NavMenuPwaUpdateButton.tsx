import { UilRedo } from "@/web/components/icons/UilRedo";
import { MenuItemButtonLayout } from "@/web/components/button/layouts/MenuItemButtonLayout";
import { AccentButtonHousing } from "@/web/components/button/housings/AccentButtonHousing";
import { useServiceWorker } from "@/web/hooks/use-service-worker";
import { useEffect, useState } from "preact/hooks";
import { PageCenterer } from "@/web/components/page/PageCenterer";

type NavMenuPwaUpdateButtonProps = {
  menuFullyClosed: boolean;
};

export function NavMenuPwaUpdateButton(props: NavMenuPwaUpdateButtonProps) {
  const { isUpdateAvailable, update } = useServiceWorker();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Never toggle showPrompt if the menu is already open (avoids a layout
    // shift).
    if (!props.menuFullyClosed) return;

    setShowPrompt(isUpdateAvailable);
  }, [isUpdateAvailable, props.menuFullyClosed]);

  if (!showPrompt) return null;

  return (
    <AccentButtonHousing rounded={false} onClick={() => void update()}>
      <PageCenterer>
        <MenuItemButtonLayout
          icon={UilRedo}
          // TODO: This text needs to wrap when the page is narrow!
          text="Update available — click to refresh"
          outerPadding
        />
      </PageCenterer>
    </AccentButtonHousing>
  );
}

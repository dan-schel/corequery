import { useMemo, useState } from "preact/hooks";
import { registerSW } from "virtual:pwa-register";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { Button } from "@/web/components/button/Button";
import { useStaticData } from "@/web/hooks/use-static-data";

export function PwaStatus() {
  const { frontendVersion } = useStaticData();

  return (
    <Column class="gap-4">
      <TextBlock style="strong">PWA Status</TextBlock>
      <TextBlock>Version: {frontendVersion.slice(0, 7)}...</TextBlock>
      <StatusMessageAndReloadPrompt />
    </Column>
  );
}

function StatusMessageAndReloadPrompt() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  const update = useMemo(() => {
    return registerSW({
      onRegisteredSW: () => {},
      onRegisterError: (e) => console.warn("Service worker error:", e),
      onNeedRefresh: () => setUpdateAvailable(true),
      onOfflineReady: () => setOfflineReady(true),
    });
  }, []);

  function handleUpdateClick() {
    void update();
  }

  if (updateAvailable) {
    return (
      <>
        <TextBlock>Update available</TextBlock>
        <Button onClick={handleUpdateClick} text="Update" />
      </>
    );
  }

  if (offlineReady) {
    return <TextBlock>App ready to work offline</TextBlock>;
  }

  return <TextBlock>Nothing to report!</TextBlock>;
}

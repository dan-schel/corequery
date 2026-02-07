import { useMemo, useState } from "preact/hooks";
import { registerSW } from "virtual:pwa-register";
import { useStaticData } from "@/web/data/static-data";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { Button } from "@/web/components/core/Button";

export function PwaStatus() {
  const { frontendVersion } = useStaticData();

  return (
    <Column class="gap-4">
      <TextBlock style="strong">PWA Status</TextBlock>
      <TextBlock>Version: {frontendVersion}</TextBlock>
      <StatusMessageAndReloadPrompt />
    </Column>
  );
}

function StatusMessageAndReloadPrompt() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  const update = useMemo(() => {
    return registerSW({
      onRegisteredSW: () => console.log("Service worker registered."),
      onRegisterError: (e) => console.error("Service worker error:", e),
      onNeedRefresh: () => setUpdateAvailable(true),
      onOfflineReady: () => setOfflineReady(true),
    });
  }, []);

  async function handleUpdateClick() {
    await update();
  }

  if (updateAvailable) {
    return (
      <>
        <TextBlock>Update available</TextBlock>
        <Button onClick={handleUpdateClick}>Update</Button>
      </>
    );
  }

  if (offlineReady) {
    return <TextBlock>App ready to work offline</TextBlock>;
  }

  return <TextBlock>Nothing to report!</TextBlock>;
}

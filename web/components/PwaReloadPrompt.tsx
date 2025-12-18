import { useMemo, useState } from "preact/hooks";
import { registerSW } from "virtual:pwa-register";

export function ReloadPrompt() {
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
    return <NeedsRefreshMessage onReloadClick={handleUpdateClick} />;
  }

  if (offlineReady) {
    return <OfflineReadyMessage />;
  }

  return <NothingToReportMessage />;
}

function OfflineReadyMessage() {
  return <span>PWA: App ready to work offline</span>;
}

function NeedsRefreshMessage({ onReloadClick }: { onReloadClick: () => void }) {
  return (
    <div>
      <span>PWA: Update available</span>
      <button onClick={onReloadClick}>Update</button>
    </div>
  );
}

function NothingToReportMessage() {
  return <span>PWA: Nothing to report!</span>;
}

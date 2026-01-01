import { useMemo, useState } from "preact/hooks";
import { registerSW } from "virtual:pwa-register";
import { useStaticData } from "../data/static-data";

export function PwaStatus() {
  const { frontendVersion } = useStaticData();

  return (
    <div>
      <span>Version: {frontendVersion}</span>
      <br />
      <StatusMessageAndReloadPrompt />
    </div>
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
        <span>Update available</span>
        <button onClick={handleUpdateClick}>Update</button>
      </>
    );
  }

  if (offlineReady) {
    return <span>App ready to work offline</span>;
  }

  return <span>Nothing to report!</span>;
}

import type { ComponentChildren } from "preact";
import { useMemo, useState } from "preact/hooks";
import { registerSW } from "virtual:pwa-register";
import { serviceWorkerContext } from "@/web/hooks/use-service-worker";

type ServiceWorkerProviderProps = {
  children?: ComponentChildren;
};

export function ServiceWorkerProvider(props: ServiceWorkerProviderProps) {
  const { Provider } = serviceWorkerContext;

  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isOfflineReady, setIsOfflineReady] = useState(false);

  const update = useMemo(() => {
    return registerSW({
      onRegisteredSW: () => {},
      onRegisterError: (e) => console.warn("Service worker error:", e),
      onNeedRefresh: () => setIsUpdateAvailable(true),
      onOfflineReady: () => setIsOfflineReady(true),
    });
  }, []);

  const serviceWorker = useMemo(() => {
    return {
      isUpdateAvailable,
      isOfflineReady,
      update,
    };
  }, [isUpdateAvailable, isOfflineReady, update]);

  return <Provider value={serviceWorker}>{props.children}</Provider>;
}

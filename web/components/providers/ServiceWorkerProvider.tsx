import type { ComponentChildren } from "preact";
import { useCallback, useMemo, useState } from "preact/hooks";
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

  // TODO: Use this for the force update mechanism.
  const unregister = useCallback(async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    } catch (e) {
      // Unregistration is best effort. Apparently navigator.serviceWorker is
      // only available in secure contexts.
      console.warn("Failed to unregister service worker:", e);
    }
  }, []);

  const serviceWorker = useMemo(() => {
    return {
      isUpdateAvailable,
      isOfflineReady,
      update,
      unregister,
    };
  }, [isUpdateAvailable, isOfflineReady, update, unregister]);

  return <Provider value={serviceWorker}>{props.children}</Provider>;
}

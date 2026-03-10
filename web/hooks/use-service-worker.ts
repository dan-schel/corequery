import { createContext } from "preact";
import { useContext } from "preact/hooks";

export type ServiceWorker = {
  readonly isUpdateAvailable: boolean;
  readonly isOfflineReady: boolean;
  readonly update: (reloadPage?: boolean) => Promise<void>;
};

export const serviceWorkerContext = createContext<ServiceWorker | null>(null);

export function useServiceWorker(): ServiceWorker {
  const serviceWorker = useContext(serviceWorkerContext);

  if (serviceWorker == null) {
    throw new Error("Service worker data unavailable outside provider.");
  }

  return serviceWorker;
}

import clsx from "clsx";
import { Button } from "@/web/components/button/Button";
import { useEffect, useState } from "preact/hooks";
import { useServiceWorker } from "@/web/hooks/use-service-worker";
import { MingcuteCloseLine } from "@/web/components/icons/MingcuteCloseLine";
import { MingcuteCheckLine } from "@/web/components/icons/MingcuteCheckLine";

type DebugPwaStatusIndicatorProps = {
  class?: string;
};

export function DebugPwaStatusIndicator(props: DebugPwaStatusIndicatorProps) {
  // A little debug indicator for PWA service worker status, which is only
  // visible on localhost.

  const { unregister } = useServiceWorker();

  const [swFound, setSwFound] = useState<boolean | null>(null);

  useEffect(() => {
    async function run() {
      if (window.location.hostname !== "localhost") return;

      const registrations = await navigator.serviceWorker.getRegistrations();
      setSwFound(registrations.length > 0);
    }
    void run();

    const interval = setInterval(() => {
      void run();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function handleUnregister() {
    async function run() {
      await unregister();
      window.location.reload();
    }
    void run();
  }

  if (swFound === null) {
    return null;
  } else if (swFound) {
    return (
      <Button
        class={clsx(props.class)}
        theme="success"
        layout="tiny"
        onClick={handleUnregister}
        text="SW registered"
        icon={MingcuteCheckLine}
      />
    );
  } else {
    return (
      <Button
        class={clsx(props.class)}
        theme="default"
        layout="tiny"
        href="/debug"
        text="No SW registered"
        icon={MingcuteCloseLine}
      />
    );
  }
}

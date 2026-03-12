import type { ComponentChildren } from "preact";
import { useStaticData } from "@/web/hooks/use-static-data";
import { useServiceWorker } from "@/web/hooks/use-service-worker";
import { useQuery } from "@/web/hooks/use-query";
import { VERSION_CHECK_V1 } from "@/shared/apis";
import { useEffect } from "preact/hooks";
import { useEnvironment } from "@/web/hooks/use-environment";

type ForceUpdateControllerProps = {
  class?: string;
  children?: ComponentChildren;
};

export function ForceUpdateController(props: ForceUpdateControllerProps) {
  const { isHotReloadingEnabled } = useEnvironment();
  const { frontendVersion, corequeryPackageVersion } = useStaticData();
  const { unregister } = useServiceWorker();

  const { data, loading, error } = useQuery(VERSION_CHECK_V1, {
    frontendVersion,
    corequeryPackageVersion,
  });

  const forceUpdateRequired =
    !isHotReloadingEnabled &&
    !loading &&
    error == null &&
    data != null &&
    data.isForceUpdateOfServiceWorkerRequired;

  useEffect(() => {
    async function run() {
      if (forceUpdateRequired) {
        await unregister();
        window.location.reload();
      }
    }
    void run();
  }, [forceUpdateRequired, unregister]);

  return props.children;
}

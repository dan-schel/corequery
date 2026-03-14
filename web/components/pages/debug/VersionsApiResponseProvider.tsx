import type { ComponentChildren } from "preact";
import { versionsApiResponseContext } from "@/web/components/pages/debug/use-versions-api-response";
import { useQuery } from "@/web/hooks/use-query";
import { VERSIONS_V1 } from "@/shared/apis";

type VersionsApiResponseProviderProps = {
  children?: ComponentChildren;
};

export function VersionsApiResponseProvider(
  props: VersionsApiResponseProviderProps,
) {
  const response = useQuery(VERSIONS_V1, {});

  return (
    <versionsApiResponseContext.Provider value={response}>
      {props.children}
    </versionsApiResponseContext.Provider>
  );
}

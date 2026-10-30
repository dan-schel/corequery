import { createContext } from "preact";
import type { UseQueryResult } from "@/web/hooks/use-query";
import { VERSIONS_V1 } from "@/shared/apis";
import { useContext } from "preact/hooks";

type VersionsApiResponse = UseQueryResult<typeof VERSIONS_V1>;

export const versionsApiResponseContext =
  createContext<VersionsApiResponse | null>(null);

export function useVersionsApiResponse(): VersionsApiResponse {
  const response = useContext(versionsApiResponseContext);

  if (response == null) {
    throw new Error("Foundational data unavailable outside provider.");
  }

  return response;
}

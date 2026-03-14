import { createContext } from "preact";
import { useContext } from "preact/hooks";

export type StaticData = {
  readonly appName: string;
  readonly frontendVersion: string;
  readonly versionsOnLastUpdate: {
    readonly corequeryPackageVersion: string;
    readonly serverVersion: string;
  };
};

export const staticDataContext = createContext<StaticData | null>(null);

export function useStaticData(): StaticData {
  const staticData = useContext(staticDataContext);

  if (staticData == null) {
    throw new Error("Static data unavailable outside provider.");
  }

  return staticData;
}

import { type ComponentChildren } from "preact";
import { useMemo } from "preact/hooks";
import { retrieveStaticData, staticDataContext } from "@/web/data/static-data";

type StaticDataProviderProps = {
  children: ComponentChildren;
};

export function StaticDataProvider(props: StaticDataProviderProps) {
  const { Provider } = staticDataContext;

  const data = useMemo(() => retrieveStaticData(document), []);

  return <Provider value={{ ready: true, ...data }}>{props.children}</Provider>;
}

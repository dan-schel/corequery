import { type VNode } from "preact";
import { useMemo } from "preact/hooks";
import { retrieveStaticData, staticDataContext } from "../data/static-data";

type StaticDataProviderProps = {
  children: VNode;
};

export function StaticDataProvider(props: StaticDataProviderProps) {
  const { Provider } = staticDataContext;

  const data = useMemo(() => retrieveStaticData(document), []);

  return <Provider value={{ ready: true, ...data }}>{props.children}</Provider>;
}

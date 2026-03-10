import { type ComponentChildren } from "preact";
import { useMemo } from "preact/hooks";
import {
  staticDataContext,
  type StaticData,
} from "@/web/hooks/use-static-data";

type StaticDataProviderProps = {
  children: ComponentChildren;
};

export function StaticDataProvider(props: StaticDataProviderProps) {
  const { Provider } = staticDataContext;

  const data = useMemo(() => retrieveStaticData(document), []);

  return <Provider value={data}>{props.children}</Provider>;
}

function retrieveStaticData(document: Document): StaticData {
  function getContent(selector: string) {
    const tag = document.querySelector(selector);
    if (tag == null) throw new Error(`${selector} tag not found.`);
    const content = tag.getAttribute("content");
    if (content == null) throw new Error(`${selector} tag was empty.`);
    return content;
  }

  return {
    appName: getContent('meta[name="corequery-app-name"]'),
    frontendVersion: getContent('meta[name="corequery-frontend-version"]'),
  };
}

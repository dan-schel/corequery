import { createContext } from "preact";
import { useContext } from "preact/hooks";

type StaticData = {
  appName: string;
  frontendVersion: string;
};

type ContextContent = StaticData & { ready: boolean };

export const staticDataContext = createContext<ContextContent>({
  ready: false,
  appName: "",
  frontendVersion: "",
});

export function useStaticData(): StaticData {
  const { ready, appName, frontendVersion } = useContext(staticDataContext);

  if (!ready) {
    throw new Error("Static data unavailable outside provider.");
  }

  return { appName, frontendVersion };
}

export function retrieveStaticData(document: Document): StaticData {
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

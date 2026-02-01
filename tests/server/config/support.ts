import { LineConfig, LintableConfig, TagsConfig } from "../../../server/config";

export const emptyLintableConfig: LintableConfig = {
  stops: [],
  lines: [],
  terminology: {
    stop: "station",
    line: "line",
    stopPosition: "platform",
  },
  linesPage: {
    sections: [],
  },
  landingPage: {
    primaryMarkdown: "",
  },
  footer: {
    footerMessageMarkdown: "",
  },
  aboutPage: {
    primaryMarkdown: "",
    dataSources: [],
  },
  tags: {
    stopTagSuccession: {},
    lineTagSuccession: {},
    routeTagSuccession: {},
  },
};

export const emptyLineConfig: LineConfig = {
  id: 0,
  name: "",
  tags: [],
  code: null,
  urlPath: "",
  routes: [],
  diagram: { entries: [] },
};

export const emptyTagsConfig: TagsConfig = {
  stopTagSuccession: {},
  lineTagSuccession: {},
  routeTagSuccession: {},
};

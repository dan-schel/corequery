import { describe, expect, it } from "vitest";
import { lintConfig } from "../../../../server/config/linting/lint.js";
import type { CorequeryConfig } from "../../../../server/config/config.js";

const createMinimalConfig = (): CorequeryConfig => ({
  port: 3000,
  assets: {
    faviconSvg: "",
    icon192: "",
    icon512: "",
    iconMaskable192: "",
    iconMaskable512: "",
  },
  stops: [],
  lines: [],
  terminology: {
    stop: { singular: "Stop", plural: "Stops" },
    line: { singular: "Line", plural: "Lines" },
    position: { singular: "Position", plural: "Positions" },
  },
  landingPage: {
    title: "Title",
    subtitle: "Subtitle",
  },
  footer: {
    copyright: "Copyright",
    links: [],
  },
  aboutPage: {
    paragraphs: [],
  },
  linesPage: {
    sections: [],
  },
  tags: {
    stopTagSuccession: {},
    lineTagSuccession: {},
    routeTagSuccession: {},
  },
});

describe("lintConfig", () => {
  it("returns no issues for valid config", () => {
    const config = createMinimalConfig();
    const issues = lintConfig(config);
    expect(issues).toEqual([]);
  });

  it("detects duplicate stop IDs", () => {
    const config = createMinimalConfig();
    config.stops = [
      {
        id: 1,
        name: "Stop A",
        tags: [],
        urlPath: "/a",
        location: null,
        positions: [],
      },
      {
        id: 1,
        name: "Stop B",
        tags: [],
        urlPath: "/b",
        location: null,
        positions: [],
      },
    ];
    const issues = lintConfig(config);
    expect(issues.length).toBeGreaterThan(0);
    expect(
      issues.some((i) => i.message.includes("Stop ID 1 is duplicated")),
    ).toBe(true);
  });

  it("detects duplicate line IDs", () => {
    const config = createMinimalConfig();
    config.lines = [
      {
        id: 1,
        name: "Line A",
        code: null,
        tags: [],
        urlPath: "/a",
        routes: [],
        diagram: { entries: [] },
      },
      {
        id: 1,
        name: "Line B",
        code: null,
        tags: [],
        urlPath: "/b",
        routes: [],
        diagram: { entries: [] },
      },
    ];
    const issues = lintConfig(config);
    expect(issues.length).toBeGreaterThan(0);
    expect(
      issues.some((i) => i.message.includes("Line ID 1 is duplicated")),
    ).toBe(true);
  });
});

import type {
  LineConfig,
  LineDiagramConfig,
} from "@/server/config/types/line-config.js";
import type { StopConfig } from "@/server/config/types/stop-config.js";
import type { LinesPageConfig } from "@/server/config/types/lines-page-config.js";
import type { TagsConfig } from "@/server/config/types/tags-config.js";

export function createStop(overrides: Partial<StopConfig> = {}): StopConfig {
  return {
    id: 1,
    name: "Stop",
    tags: [],
    urlPath: "/stop",
    location: null,
    positions: [],
    ...overrides,
  };
}

export function createDiagramEntry(
  overrides: Partial<LineDiagramConfig["entries"][number]> = {},
): LineDiagramConfig["entries"][number] {
  return {
    name: null,
    color: "red",
    shape: {
      type: "linear",
      stops: [
        { stopId: 1, type: "regular" },
        { stopId: 2, type: "regular" },
      ],
    },
    ...overrides,
  };
}

export function createDiagramWithStops(stopIds: number[]): LineDiagramConfig {
  return {
    entries: [
      createDiagramEntry({
        shape: {
          type: "linear",
          stops: stopIds.map((stopId) => ({ stopId, type: "regular" })),
        },
      }),
    ],
  };
}

export function createLine(overrides: Partial<LineConfig> = {}): LineConfig {
  return {
    id: 1,
    name: "Line",
    code: null,
    tags: [],
    urlPath: "/line",
    diagram: { entries: [createDiagramEntry()] },
    color: null,
    ...overrides,
  };
}

export function createLinesPage(
  overrides: Partial<LinesPageConfig> = {},
): LinesPageConfig {
  return {
    sections: [],
    ...overrides,
  };
}

export function createTagsConfig(
  overrides: Partial<TagsConfig> = {},
): TagsConfig {
  return {
    stopTagSuccession: {},
    lineTagSuccession: {},
    ...overrides,
  };
}

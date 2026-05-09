import { describe, expect, it } from "vitest";
import { createCanonicalLinesServingStopAlgorithm } from "@/server/config/helpers/create-canonical-lines-serving-stop-algorithm.js";
import {
  createDiagramWithStops,
  createLine,
} from "@/tests/server/config/linting/support/factories.js";

describe("createCanonicalLinesServingStopAlgorithm", () => {
  it("returns all matching lines when no tiers are configured", () => {
    const getCanonicalLinesServingStop =
      createCanonicalLinesServingStopAlgorithm({
        lines: [
          createLine({
            id: 10,
            diagram: createDiagramWithStops([1, 2]),
          }),
          createLine({
            id: 20,
            diagram: createDiagramWithStops([1, 3]),
          }),
          createLine({
            id: 30,
            diagram: createDiagramWithStops([2, 3]),
          }),
        ],
        lineTagSuccession: {},
      });

    expect(getCanonicalLinesServingStop(1)).toEqual([10, 20]);
  });

  it("only returns lines from the highest-priority populated tier", () => {
    const GREAT_LINE = 101;
    const AWFUL_LINE = 102;
    const HIGH_PRIORITY = 103;
    const LOW_PRIORITY = 104;

    const getCanonicalLinesServingStop =
      createCanonicalLinesServingStopAlgorithm({
        lines: [
          createLine({
            id: 1,
            tags: [GREAT_LINE],
            diagram: createDiagramWithStops([77, 78]),
          }),
          createLine({
            id: 2,
            tags: [AWFUL_LINE],
            diagram: createDiagramWithStops([77, 78]),
          }),
          createLine({
            id: 3,
            tags: [AWFUL_LINE],
            diagram: createDiagramWithStops([77, 78]),
          }),
        ],
        lineTagSuccession: {
          [GREAT_LINE]: [HIGH_PRIORITY],
          [AWFUL_LINE]: [LOW_PRIORITY],
        },
        tierLinesByTag: [HIGH_PRIORITY, LOW_PRIORITY],
      });

    expect(getCanonicalLinesServingStop(77)).toEqual([1]);
  });

  it("includes untiered lines alongside first-tier lines", () => {
    const TIERED_TAG = 55;

    const getCanonicalLinesServingStop =
      createCanonicalLinesServingStopAlgorithm({
        lines: [
          createLine({
            id: 100,
            tags: [TIERED_TAG],
            diagram: createDiagramWithStops([5]),
          }),
          createLine({
            id: 200,
            tags: [],
            diagram: createDiagramWithStops([5]),
          }),
        ],
        lineTagSuccession: {},
        tierLinesByTag: [TIERED_TAG],
      });

    expect(getCanonicalLinesServingStop(5)).toEqual([100, 200]);
  });
});

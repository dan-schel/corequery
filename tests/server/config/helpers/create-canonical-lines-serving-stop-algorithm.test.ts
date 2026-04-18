import { describe, expect, it } from "vitest";
import { createCanonicalLinesServingStopAlgorithm } from "@/server/config/helpers/create-canonical-lines-serving-stop-algorithm.js";
import {
  createLine,
  createRoute,
} from "@/tests/server/config/linting/support/factories.js";

describe("createCanonicalLinesServingStopAlgorithm", () => {
  it("returns all matching lines when no tiers are configured", () => {
    const getCanonicalLinesServingStop =
      createCanonicalLinesServingStopAlgorithm({
        lines: [
          createLine({
            id: 10,
            routes: [createRoute({ stops: [{ stopId: 1, type: "regular" }] })],
          }),
          createLine({
            id: 20,
            routes: [createRoute({ stops: [{ stopId: 1, type: "regular" }] })],
          }),
          createLine({
            id: 30,
            routes: [createRoute({ stops: [{ stopId: 2, type: "regular" }] })],
          }),
        ],
        lineTagSuccession: {},
        routeTagSuccession: {},
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
            routes: [createRoute({ stops: [{ stopId: 77, type: "regular" }] })],
          }),
          createLine({
            id: 2,
            tags: [AWFUL_LINE],
            routes: [createRoute({ stops: [{ stopId: 77, type: "regular" }] })],
          }),
          createLine({
            id: 3,
            tags: [AWFUL_LINE],
            routes: [createRoute({ stops: [{ stopId: 77, type: "regular" }] })],
          }),
        ],
        lineTagSuccession: {
          [GREAT_LINE]: [HIGH_PRIORITY],
          [AWFUL_LINE]: [LOW_PRIORITY],
        },
        routeTagSuccession: {},
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
            routes: [createRoute({ stops: [{ stopId: 5, type: "regular" }] })],
          }),
          createLine({
            id: 200,
            tags: [],
            routes: [createRoute({ stops: [{ stopId: 5, type: "regular" }] })],
          }),
        ],
        lineTagSuccession: {},
        routeTagSuccession: {},
        tierLinesByTag: [TIERED_TAG],
      });

    expect(getCanonicalLinesServingStop(5)).toEqual([100, 200]);
  });

  it("can ignore routes via tags", () => {
    const AWFUL_ROUTE = 9;
    const ROUTE_TO_IGNORE = 10;

    const getCanonicalLinesServingStop =
      createCanonicalLinesServingStopAlgorithm({
        lines: [
          createLine({
            id: 1,
            routes: [
              createRoute({
                tags: [AWFUL_ROUTE],
                stops: [{ stopId: 90, type: "regular" }],
              }),
            ],
          }),
        ],
        lineTagSuccession: {},
        routeTagSuccession: { [AWFUL_ROUTE]: [ROUTE_TO_IGNORE] },
        ignoreRoutesWithTags: [ROUTE_TO_IGNORE],
        ignoreHiddenStops: false,
      });

    expect(getCanonicalLinesServingStop(90)).toEqual([]);
  });

  describe("with hidden stops", () => {
    const lines = [
      createLine({
        id: 2,
        routes: [
          createRoute({
            stops: [{ stopId: 90, type: "hidden-unless-stopped-at" }],
          }),
        ],
      }),
    ];

    it("ignores hidden stops by default", () => {
      const getCanonicalLinesServingStop =
        createCanonicalLinesServingStopAlgorithm({
          lines: lines,
          lineTagSuccession: {},
          routeTagSuccession: {},
        });
      expect(getCanonicalLinesServingStop(90)).toEqual([]);
    });

    it("can include hidden stops if configured to", () => {
      const getCanonicalLinesServingStop =
        createCanonicalLinesServingStopAlgorithm({
          lines: lines,
          lineTagSuccession: {},
          routeTagSuccession: {},
          ignoreHiddenStops: false,
        });
      expect(getCanonicalLinesServingStop(90)).toEqual([2]);
    });
  });
});

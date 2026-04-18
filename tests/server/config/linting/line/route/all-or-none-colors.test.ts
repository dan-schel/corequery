import { describe, it } from "vitest";
import { checkRoutesAllOrNoneHaveColors } from "@/server/config/linting/line/route/all-or-none-colors-global.js";
import { collectIssues } from "@/tests/server/config/linting/support/collect-issues.js";
import { expectIssueMessages } from "@/tests/server/config/linting/support/expect-issues.js";
import {
  createLine,
  createRoute,
} from "@/tests/server/config/linting/support/factories.js";

describe("checkRoutesAllOrNoneHaveColors", () => {
  it("returns no issues when all route colors are missing across all lines", () => {
    const lines = [
      createLine({
        id: 1,
        routes: [
          createRoute({ id: 1, color: null }),
          createRoute({ id: 2, color: null }),
        ],
      }),
      createLine({
        id: 2,
        routes: [
          createRoute({ id: 3, color: null }),
          createRoute({ id: 4, color: null }),
        ],
      }),
    ];

    const issues = collectIssues(checkRoutesAllOrNoneHaveColors, lines, {});

    expectIssueMessages(issues, []);
  });

  it("returns no issues when all route colors are present across all lines", () => {
    const lines = [
      createLine({
        id: 1,
        routes: [
          createRoute({ id: 1, color: "red" }),
          createRoute({ id: 2, color: "blue" }),
        ],
      }),
      createLine({
        id: 2,
        routes: [
          createRoute({ id: 3, color: "green" }),
          createRoute({ id: 4, color: "yellow" }),
        ],
      }),
    ];

    const issues = collectIssues(checkRoutesAllOrNoneHaveColors, lines, {});

    expectIssueMessages(issues, []);
  });

  it("returns issues when route colors are mixed across lines", () => {
    const lines = [
      createLine({
        id: 1,
        routes: [createRoute({ id: 1, color: null })],
      }),
      createLine({
        id: 2,
        routes: [createRoute({ id: 2, color: "green" })],
      }),
    ];

    const issues = collectIssues(checkRoutesAllOrNoneHaveColors, lines, {});

    expectIssueMessages(issues, ['Route "Route" is missing a color.']);
  });

  it("ignores missing route colors when configured", () => {
    const lines = [
      createLine({
        id: 1,
        routes: [createRoute({ id: 1, color: null })],
      }),
      createLine({
        id: 2,
        routes: [createRoute({ id: 2, color: "green" })],
      }),
    ];

    const issues = collectIssues(checkRoutesAllOrNoneHaveColors, lines, {
      1: { routes: { 1: { ignoreMissingColor: true } } },
    });

    expectIssueMessages(issues, []);
  });
});

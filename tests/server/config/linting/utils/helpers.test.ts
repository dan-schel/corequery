import { describe, expect, it } from "vitest";
import {
  createIssue,
  findDuplicates,
  allOrNone,
} from "../../../../../server/config/linting/utils/helpers.js";

describe("createIssue", () => {
  it("creates issue with message only", () => {
    const issue = createIssue("Test message");
    expect(issue).toEqual({ message: "Test message" });
  });

  it("creates issue with message and path", () => {
    const issue = createIssue("Test message", "stops[0].id");
    expect(issue).toEqual({ message: "Test message", path: "stops[0].id" });
  });
});

describe("findDuplicates", () => {
  it("returns empty map when no duplicates", () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const duplicates = findDuplicates(items, (item) => item.id);
    expect(duplicates.size).toBe(0);
  });

  it("finds duplicates", () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 1 }];
    const duplicates = findDuplicates(items, (item) => item.id);
    expect(duplicates.size).toBe(1);
    expect(duplicates.get(1)).toEqual([0, 2]);
  });
});

describe("allOrNone", () => {
  it("returns all when all items have property", () => {
    const items = [{ value: 1 }, { value: 2 }];
    const result = allOrNone(items, (item) => item.value > 0);
    expect(result).toBe("all");
  });

  it("returns none when no items have property", () => {
    const items = [{ value: 1 }, { value: 2 }];
    const result = allOrNone(items, (item) => item.value < 0);
    expect(result).toBe("none");
  });

  it("returns mixed when some items have property", () => {
    const items = [{ value: 1 }, { value: -1 }];
    const result = allOrNone(items, (item) => item.value > 0);
    expect(result).toBe("mixed");
  });
});

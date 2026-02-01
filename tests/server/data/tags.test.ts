import { describe, expect, it } from "vitest";
import { type TagSuccessionConfig } from "../../../server/config/tags-config.js";
import { Tags } from "../../../server/data/tags.js";

describe("Tags", () => {
  describe(".build", () => {
    it("correctly calculates tag succession", () => {
      const explicitTags = [1, 2, 3];
      const succession: TagSuccessionConfig = {
        6: [7],
        1: [4],
        2: [5, 6],
        8: [9, 10],
        11: [12],
      };
      const tags = Tags.build(explicitTags, succession);

      expect(tags.has(1)).toBe(true);
      expect(tags.has(2)).toBe(true);
      expect(tags.has(3)).toBe(true);
      expect(tags.has(4)).toBe(true);
      expect(tags.has(5)).toBe(true);
      expect(tags.has(6)).toBe(true);
      expect(tags.has(7)).toBe(true);
      expect(tags.has(8)).toBe(false);
      expect(tags.has(9)).toBe(false);
      expect(tags.has(10)).toBe(false);
      expect(tags.has(11)).toBe(false);
      expect(tags.has(12)).toBe(false);
    });

    it("handles circular tag successions", () => {
      const explicitTags = [1];
      const succession: TagSuccessionConfig = {
        3: [1],
        2: [3],
        1: [2],
        4: [5],
      };
      const tags = Tags.build(explicitTags, succession);

      expect(tags.has(1)).toBe(true);
      expect(tags.has(2)).toBe(true);
      expect(tags.has(3)).toBe(true);
      expect(tags.has(4)).toBe(false);
      expect(tags.has(5)).toBe(false);
    });
  });
});

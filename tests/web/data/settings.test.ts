import { describe, expect, it } from "vitest";
import { Settings } from "@/web/data/settings";

describe("Settings", () => {
  describe("Settings.json.parse", () => {
    it("accepts valid v1 settings JSON", () => {
      // Do NOT change this test to add a field. Add a new test instead. This
      // test should ALWAYS pass, forever, otherwise people are gonna lose their
      // settings :(
      const json = { version: 1, theme: "light" };

      const settings = Settings.json.parse(json);
      expect(settings).toBeInstanceOf(Settings);
      expect(settings.theme).toBe("light");
    });

    it("rejects an invalid version", () => {
      expect(() =>
        Settings.json.parse({ version: 0, theme: "dark" }),
      ).toThrow();
    });

    it("rejects an invalid theme", () => {
      expect(() =>
        Settings.json.parse({ version: 1, theme: "purple" }),
      ).toThrow();
    });
  });
});

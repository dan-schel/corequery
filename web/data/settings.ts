import z from "zod";
import type { FoundationalData } from "@/web/data/foundational-data";
import type { Theme } from "@/web/data/theme";
import { deepEquals } from "@dan-schel/js-utils";

type SettingsFields = {
  readonly theme: Theme;
};

export class Settings {
  readonly theme: Theme;

  constructor(fields: SettingsFields) {
    this.theme = fields.theme;
  }

  static readonly default = new Settings({ theme: "auto" });

  static readonly json = z
    .object({
      version: z.literal(1),
      theme: z.enum(["dark", "light", "auto"]).optional(),

      // Future fields must be optional, otherwise it requires a version bump.
    })
    .transform(
      (x) => new Settings({ theme: x.theme ?? Settings.default.theme }),
    );

  with(newValues: Partial<SettingsFields>): Settings {
    return new Settings({ ...this, ...newValues });
  }

  toJson(): z.input<typeof Settings.json> {
    return {
      version: 1,
      theme: this.theme,
    };
  }

  validate(_foundationalData: FoundationalData): Settings {
    // Use this to gracefully amend settings which are no longer valid after
    // foundational data changes.
    return this;
  }

  equals(other: Settings): boolean {
    return deepEquals(this.toJson(), other.toJson());
  }
}

import type { locationFodaSchema } from "@/shared/apis/foundational-data/v1/foundational-data.js";
import type z from "zod";

export class Location {
  constructor(
    public readonly latitude: number,
    public readonly longitude: number,
  ) {}

  static buildIfPresent(
    input: {
      readonly latitude: number;
      readonly longitude: number;
    } | null,
  ) {
    if (input == null) return null;
    return new Location(input.latitude, input.longitude);
  }

  toFoda(): z.input<typeof locationFodaSchema> {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }
}

import type { Stop } from "@/server/data/stop.js";
import type { stopFodaSchema as stopFodaV1Schema } from "@/shared/apis/foundational-data/v1/foundational-data.js";
import type z from "zod";

export class MultiversionalStopFoda {
  constructor(
    readonly obj: ReturnType<typeof MultiversionalStopFoda._buildObj>,
  ) {}

  static build(stop: Stop) {
    return new MultiversionalStopFoda(MultiversionalStopFoda._buildObj(stop));
  }

  private static _buildObj(stop: Stop) {
    return {
      id: stop.id,
      name: stop.name,
      urlPath: stop.urlPath,
      canonicalLinesServingStop: stop.canonicalLinesServingStop,
      location:
        stop.location != null
          ? {
              latitude: stop.location.latitude,
              longitude: stop.location.longitude,
            }
          : null,
    };
  }

  toFodaV1(): z.input<typeof stopFodaV1Schema> {
    return {
      id: this.obj.id,
      name: this.obj.name,
      urlPath: this.obj.urlPath,
      canonicalLinesServingStop: this.obj.canonicalLinesServingStop,
      location: this.obj.location,
    };
  }
}

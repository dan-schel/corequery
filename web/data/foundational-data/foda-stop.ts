import type { stopFodaSchema } from "@/shared/apis/foundational-data/v1/foundational-data";
import { FodaStopPositionCollection } from "@/web/data/foundational-data/foda-stop-position-collection";
import type z from "zod";

type FodaStopFields = {
  readonly id: number;
  readonly name: string;
  readonly urlPath: string;
  readonly canonicalLinesServingStop: readonly number[];
  readonly positions: FodaStopPositionCollection;
  readonly defaultDepartureFeeds: readonly FodaDefaultDepartureFeed[];
};

type FodaDefaultDepartureFeed = z.output<
  typeof stopFodaSchema
>["defaultDepartureFeeds"][number];

export class FodaStop {
  readonly id: number;
  readonly name: string;
  readonly urlPath: string;
  readonly canonicalLinesServingStop: readonly number[];
  readonly positions: FodaStopPositionCollection;
  readonly defaultDepartureFeeds: readonly FodaDefaultDepartureFeed[];

  constructor(fields: FodaStopFields) {
    this.id = fields.id;
    this.name = fields.name;
    this.urlPath = fields.urlPath;
    this.canonicalLinesServingStop = fields.canonicalLinesServingStop;
    this.positions = fields.positions;
    this.defaultDepartureFeeds = fields.defaultDepartureFeeds;
  }

  static build(raw: z.output<typeof stopFodaSchema>) {
    return new FodaStop({
      id: raw.id,
      name: raw.name,
      urlPath: raw.urlPath,
      canonicalLinesServingStop: raw.canonicalLinesServingStop,
      positions: new FodaStopPositionCollection(raw.positions),
      defaultDepartureFeeds: raw.defaultDepartureFeeds,
    });
  }
}

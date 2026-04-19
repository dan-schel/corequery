import type { stopFodaSchema } from "@/shared/apis/foundational-data/v1/foundational-data";
import { Collection } from "@/shared/data/collection";
import type z from "zod";

export type FodaStop = z.infer<typeof stopFodaSchema>;

export class FodaStopCollection extends Collection<number, FodaStop> {
  protected override _getID(item: FodaStop): number {
    return item.id;
  }

  protected override _getRequireFailError(id: number): Error {
    return new Error(`No stop with ID #${id}.`);
  }

  protected override _getPredicateFailError(): Error {
    return new Error("No matching stop.");
  }

  getByUrlPath(urlPath: string): FodaStop | null {
    return this.first((stop) => stop.urlPath === urlPath);
  }
}

import type { fodaSchema } from "@/shared/apis/foundational-data/v1/foundational-data";
import { Collection } from "@/shared/data/collection";
import { FodaStop } from "@/web/data/foundational-data/foda-stop";
import type z from "zod";

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

  static build(raw: z.output<typeof fodaSchema>["stops"]) {
    return new FodaStopCollection(raw.map((x) => FodaStop.build(x)));
  }
}

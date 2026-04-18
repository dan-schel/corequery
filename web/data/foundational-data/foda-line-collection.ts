import type { lineFodaSchema } from "@/shared/apis/foundational-data/v1/foundational-data";
import { Collection } from "@/shared/data/collection";
import type z from "zod";

export type FodaLine = z.infer<typeof lineFodaSchema>;

export class FodaLineCollection extends Collection<number, FodaLine> {
  protected override _getID(item: FodaLine): number {
    return item.id;
  }

  protected override _getRequireFailError(id: number): Error {
    return new Error(`No line with ID #${id}.`);
  }

  protected override _getPredicateFailError(): Error {
    return new Error("No matching line.");
  }

  getByUrlPath(urlPath: string): FodaLine | null {
    return this.first((line) => line.urlPath === urlPath);
  }
}

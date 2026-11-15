import type { stopFodaSchema } from "@/shared/apis/foundational-data/v1/foundational-data";
import { Collection } from "@/shared/data/collection";
import type z from "zod";

export type FodaStopPosition = z.output<
  typeof stopFodaSchema
>["positions"][number];

export class FodaStopPositionCollection extends Collection<
  number,
  FodaStopPosition
> {
  protected override _getID(item: FodaStopPosition): number {
    return item.id;
  }

  protected override _getRequireFailError(id: number): Error {
    return new Error(`No stop with ID #${id}.`);
  }

  protected override _getPredicateFailError(): Error {
    return new Error("No matching stop.");
  }
}

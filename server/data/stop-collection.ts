import { Collection } from "@/server/data/collection.js";
import type { Stop } from "@/server/data/stop.js";

export class StopCollection extends Collection<number, Stop> {
  constructor(data: readonly Stop[]) {
    super(data);
  }

  protected _getID(item: Stop): number {
    return item.id;
  }

  protected _getRequireFailError(id: number): Error {
    return new Error(`No stop with ID #${id}.`);
  }

  protected _getPredicateFailError(): Error {
    return new Error("No matching stop.");
  }
}

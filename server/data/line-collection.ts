import { Collection } from "./collection.js";
import type { Line } from "./line.js";

export class LineCollection extends Collection<number, Line> {
  constructor(data: readonly Line[]) {
    super(data);
  }

  protected _getID(item: Line): number {
    return item.id;
  }

  protected _getRequireFailError(id: number): Error {
    return new Error(`No line with ID #${id}.`);
  }

  protected _getPredicateFailError(): Error {
    return new Error("No matching line.");
  }
}

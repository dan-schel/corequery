import type {
  DeparturesIterationDirection,
  DeparturesIterator,
} from "@/server/data/service/service-source.js";
import type { Departure } from "@/server/data/service/departure.js";
import { assertNever } from "@dan-schel/js-utils";

export class ZipperDeparturesIterator implements DeparturesIterator {
  private _nextIterator: DeparturesIterator | null;
  private _isInitialized: boolean;

  constructor(
    private readonly _iterators: DeparturesIterator[],
    private readonly _direction: DeparturesIterationDirection,
  ) {
    this._nextIterator = null;
    this._isInitialized = false;
  }

  async peek(): Promise<Departure | null> {
    await this._ensureSetup();
    if (this._nextIterator == null) return null;
    return await this._nextIterator.peek();
  }

  async take(): Promise<Departure> {
    await this._ensureSetup();

    const iterator = this._nextIterator;
    if (iterator == null) throw new Error("Nothing to take.");

    const value = await iterator.take();

    this._nextIterator = await this._determineBestIterator();

    return value;
  }

  private async _ensureSetup() {
    if (!this._isInitialized) {
      this._nextIterator = await this._determineBestIterator();
      this._isInitialized = true;
    }
  }

  private async _determineBestIterator() {
    let best: Departure | null = null;
    let bestIterator: DeparturesIterator | null = null;

    for (const iterator of this._iterators) {
      const nextValue = await iterator.peek();
      if (nextValue == null) continue;

      if (
        best == null ||
        this._isBetter(
          best.movement.timeRelevantToDeparturesAlgorithm,
          nextValue.movement.timeRelevantToDeparturesAlgorithm,
        )
      ) {
        best = nextValue;
        bestIterator = iterator;
      }
    }

    // TODO: Should we be storing the `best` value we're finding here, so that
    // we don't have to call `peek` again on the subiterator? Or is it the
    // subiterator's responsibility to cache its own `peek` value?
    //
    // A: It should probably be the subiterator's responsibility, because unless
    // we cache the best value for each subiterator, we have to `peek` them all
    // again everytime we `take`, so I think we're making the assumption that
    // while `peek` has to be async for the first call, all subsequent calls
    // should be free.

    return bestIterator;
  }

  private _isBetter(
    currentBest: Temporal.Instant,
    candidate: Temporal.Instant,
  ): boolean {
    if (this._direction === "forwards") {
      return Temporal.Instant.compare(candidate, currentBest) < 0;
    } else if (this._direction === "backwards") {
      return Temporal.Instant.compare(candidate, currentBest) > 0;
    } else {
      assertNever(this._direction);
    }
  }
}

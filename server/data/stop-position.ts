/** Position within stop, a.k.a. platform, bay, wharf, etc. */
export class StopPosition {
  constructor(
    readonly stopId: number,
    readonly stopPositionId: number,
    readonly name: string,
  ) {}
}

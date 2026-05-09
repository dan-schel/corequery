export class CoreServiceTime {
  // Values greater than 24 * 60 * 60 indicate times during the next day.
  private constructor(readonly secondOfDay: number) {}
}

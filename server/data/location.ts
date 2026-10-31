export class Location {
  constructor(
    public readonly latitude: number,
    public readonly longitude: number,
  ) {}

  static buildIfPresent(
    input: {
      readonly latitude: number;
      readonly longitude: number;
    } | null,
  ) {
    if (input == null) return null;
    return new Location(input.latitude, input.longitude);
  }
}

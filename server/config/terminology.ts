export class Terminology {
  constructor(
    readonly stop: "stop" | "station",
    readonly line: "line" | "route",
    readonly stopPosition:
      | "platform"
      | "track"
      | "bay"
      | "wharf"
      | "wharf-and-side"
      | "stand",
  ) {}
}

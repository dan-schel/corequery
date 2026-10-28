export type TerminologyConfig = {
  readonly stop: "stop" | "station";
  readonly line: "line" | "route";
  readonly stopPosition:
    "platform" | "track" | "bay" | "wharf" | "wharf-and-side" | "stand";
  readonly service: "service" | "trip" | "train" | "tram" | "bus";
};

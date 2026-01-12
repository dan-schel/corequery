export class RouteStop {
  constructor(
    readonly stopId: number,
    readonly type: "regular" | "hidden-unless-stopped-at" = "regular",
  ) {}
}

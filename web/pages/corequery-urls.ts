export class CorequeryUrls {
  static readonly home = "/";
  static readonly about = "/about";
  static readonly admin = "/admin";
  static readonly debug = "/debug";
  static readonly nearby = "/nearby";
  static readonly settings = "/settings";
  static readonly status = "/status";
  static readonly zen = "/zen";

  static readonly lineUrlTemplate = "/line/:id";
  static readonly stopUrlTemplate = "/stop/:id";
  static readonly serviceUrlTemplate = "/service/:sourceId/:intrasourceId";

  static stop(stopUrlPath: string) {
    return `/stop/${stopUrlPath}`;
  }

  static line(lineUrlPath: string) {
    return `/line/${lineUrlPath}`;
  }

  static service(sourceId: string, intrasourceId: string, from: number) {
    return `/service/${encodeURIComponent(sourceId)}/${encodeURIComponent(intrasourceId)}?from=${encodeURIComponent(from.toString())}`;
  }
}

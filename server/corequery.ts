import type { CorequeryConfig } from "@/server/config/config.js";
import { serverFolderPath } from "@/server/dirname.js";
import { env } from "@/server/env.js";
import { WebServer } from "@/server/web-server/web-server.js";
import { StopCollection } from "@/server/data/stop-collection.js";
import { LineCollection } from "@/server/data/line-collection.js";

export type CorequeryConfigBuilder = (corequery: Corequery) => CorequeryConfig;

export class Corequery {
  private readonly _config: CorequeryConfig;
  private readonly _webServer: WebServer;

  readonly stops: StopCollection;
  readonly lines: LineCollection;

  constructor(configBuilder: CorequeryConfigBuilder) {
    this._config = configBuilder(this);

    this._webServer = new WebServer(
      this,
      this._config.port,
      this._config.version,
      this._config.assets,
      env.COREQUERY_HOT_RELOAD ? "vite-middleware" : "dist-folder",
      serverFolderPath,
    );

    const { stopTagSuccession, lineTagSuccession } = this._config.tags;
    this.stops = StopCollection.build(this._config.stops, stopTagSuccession);
    this.lines = LineCollection.build(this._config.lines, lineTagSuccession);
  }

  async start() {
    await this._webServer.prepareAssets();
    await this._webServer.start();
  }
}

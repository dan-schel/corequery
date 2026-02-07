import { runSharedCode } from "../shared/example.js";
import type { CorequeryConfig } from "./config/config.js";
import { FoundationalData } from "./data/foundational-data.js";
import { serverFolderPath } from "./dirname.js";
import { env } from "./env.js";
import { WebServer } from "./web-server/web-server.js";

export type CorequeryConfigBuilder = (corequery: Corequery) => CorequeryConfig;

export class Corequery {
  private readonly _config: CorequeryConfig;
  private readonly _webServer: WebServer;

  constructor(configBuilder: CorequeryConfigBuilder) {
    this._config = configBuilder(this);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const foundationalData = FoundationalData.build(this._config);

    this._webServer = new WebServer(
      this,
      this._config.port,
      this._config.assets,
      env.COREQUERY_HOT_RELOAD ? "vite-middleware" : "dist-folder",
      serverFolderPath,
    );
  }

  async start() {
    runSharedCode();

    await this._webServer.prepareAssets();
    await this._webServer.start();
  }
}

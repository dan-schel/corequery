import { runSharedCode } from "../shared/example.js";
import { serverFolderPath } from "./dirname.js";
import { env } from "./env.js";
import type { AssetConfig } from "./web-server-asset-preparer.js";
import { WebServer } from "./web-server.js";

type CorequeryConfig = {
  readonly port: number;
  readonly assets: AssetConfig;
};

type CorequeryConfigBuilder = (corequery: Corequery) => CorequeryConfig;

export class Corequery {
  private readonly _config: CorequeryConfig;
  private readonly _webServer: WebServer;

  constructor(configBuilder: CorequeryConfigBuilder) {
    this._config = configBuilder(this);

    console.log(
      "Corequery config:",
      this._config,
      env.COREQUERY_HOT_RELOAD ? "vite-middleware" : "dist-folder"
    );

    this._webServer = new WebServer(
      this,
      this._config.port,
      this._config.assets,
      env.COREQUERY_HOT_RELOAD ? "vite-middleware" : "dist-folder",
      serverFolderPath
    );
  }

  async start() {
    runSharedCode();

    await this._webServer.prepareAssets();
    await this._webServer.start();
  }
}

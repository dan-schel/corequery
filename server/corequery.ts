import { runSharedCode } from "../shared/example.js";
import { serverFolderPath } from "./dirname.js";
import { WebServer, type WebServerArgs } from "./web-server.js";

type CorequeryConfig = {
  webServer: WebServerArgs;
};

type CorequeryConfigBuilder = (corequery: Corequery) => CorequeryConfig;

export class Corequery {
  private readonly _config: CorequeryConfig;
  private readonly _webServer: WebServer;

  constructor(configBuilder: CorequeryConfigBuilder) {
    this._config = configBuilder(this);

    this._webServer = new WebServer(
      this,
      this._config.webServer,
      serverFolderPath
    );
  }

  async start() {
    runSharedCode();

    await this._webServer.start();
  }
}

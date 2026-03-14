import type { CorequeryConfig } from "@/server/config/config.js";
import { serverFolderPath } from "@/server/dirname.js";
import { env } from "@/server/env.js";
import { WebServer } from "@/server/web-server/web-server.js";
import { StopCollection } from "@/server/data/stop-collection.js";
import { LineCollection } from "@/server/data/line-collection.js";
import type { FooterConfig, LandingPageConfig } from "@/server/config/index.js";
import { getCorequeryPackageVersion } from "@/server/get-corequery-package-version.js";

export type CorequeryConfigBuilder = (corequery: Corequery) => CorequeryConfig;

export class Corequery {
  private readonly _config: CorequeryConfig;
  private readonly _webServer: WebServer;

  readonly serverVersion: string;
  private _corequeryPackageVersion: string | null;
  private _frontendVersion: string | null;

  readonly stops: StopCollection;
  readonly lines: LineCollection;

  // I'm happy just exposing the config for now. Can be migrated to full classes
  // if and when we want to add helper methods.
  readonly landingPageConfig: LandingPageConfig;
  readonly footerConfig: FooterConfig;

  constructor(configBuilder: CorequeryConfigBuilder) {
    this._config = configBuilder(this);

    this._webServer = new WebServer(
      this,
      this._config.port,
      this._config.assets,
      env.COREQUERY_HOT_RELOAD ? "vite-middleware" : "dist-folder",
      serverFolderPath,
    );

    this.serverVersion = this._config.version;

    // Currently fetched async during start().
    this._corequeryPackageVersion = null;

    // Only known after assets are prepared, during start().
    this._frontendVersion = null;

    const { stopTagSuccession, lineTagSuccession } = this._config.tags;
    this.stops = StopCollection.build(this._config.stops, stopTagSuccession);
    this.lines = LineCollection.build(this._config.lines, lineTagSuccession);

    this.landingPageConfig = this._config.landingPage;
    this.footerConfig = this._config.footer;
  }

  getCorequeryPackageVersion() {
    if (this._corequeryPackageVersion == null) {
      throw new Error("Call start() first.");
    }
    return this._corequeryPackageVersion;
  }

  getFrontendVersion() {
    if (this._frontendVersion == null) {
      throw new Error("Call start() first.");
    }
    return this._frontendVersion;
  }

  async start() {
    this._corequeryPackageVersion = await getCorequeryPackageVersion();

    await this._webServer.prepareAssets();
    this._frontendVersion = this._webServer.getFrontendVersion();

    console.log(`Starting ${this._config.assets.appName}...`);
    console.log(`- Server version: ${this.serverVersion}`);
    console.log(`- Frontend version: ${this.getFrontendVersion()}`);
    console.log(`- CoreQuery version: ${this.getCorequeryPackageVersion()}`);

    await this._webServer.start();
  }
}

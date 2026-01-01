import express from "express";
import fsp from "fs/promises";
import path from "path";
import type { Corequery } from "./corequery.js";
import {
  WebServerAssetPreparer,
  type AssetConfig,
} from "./web-server-asset-preparer.js";

export const clientModes = ["dist-folder", "vite-middleware"] as const;
export type ClientMode = (typeof clientModes)[number];

export class WebServer {
  private readonly _assetPreparer: WebServerAssetPreparer;

  constructor(
    private readonly _app: Corequery,
    private readonly _port: number,
    private readonly _assetConfig: AssetConfig,
    private readonly _clientMode: ClientMode,
    private readonly _serverFolderPath: string
  ) {
    this._assetPreparer = new WebServerAssetPreparer(_assetConfig);
  }

  async prepareAssets() {
    if (this._clientMode === "dist-folder") {
      const distFolderPath = this._getWebFolderPath("dist");
      await this._assetPreparer.prepareDistFolder(distFolderPath);
    }

    // It's hard to think of a way to reasonably replace the assets in
    // middleware mode, as you'd be replacing the source assets. It's only a
    // "nice to have" anyway, using the CoreQuery assets during demo-app
    // development is perfectly acceptable.
  }

  async start() {
    const server = express();

    // TODO: Implement APIs
    // server.use("/api", express.json(), createApiRouter(this._app));

    if (this._clientMode === "dist-folder") {
      await this._serveFrontendFromDistFolder(server);
    }
    if (this._clientMode === "vite-middleware") {
      await this._serveFrontendUsingViteMiddleware(server);
    }

    server.listen(this._port, () => {
      console.log(`Server ready (http://localhost:${this._port})!`);
    });
  }

  private async _serveFrontendFromDistFolder(server: express.Express) {
    const indexHtmlPath = this._getWebFolderPath("dist/index.html");
    const indexHtml = await fsp.readFile(indexHtmlPath, "utf-8");

    server.use(express.static(this._getWebFolderPath("dist")));

    server.use("*all", async (_req, res) => {
      res.status(200).set({ "Content-Type": "text/html" }).end(indexHtml);
    });
  }

  private async _serveFrontendUsingViteMiddleware(server: express.Express) {
    console.log("Running with Vite middleware for hot-reloading...");

    // Dynamic import, as it'll only be available when developing CoreQuery
    // (Vite is installed as a dev dependency), and apps consuming this package
    // don't have/need it.
    const { createServer } = await import("vite");

    const vite = await createServer({
      server: { middlewareMode: true },
      root: this._getWebFolderPath(),
    });
    server.use(vite.middlewares);
  }

  private _getWebFolderPath(innerPath: string = "") {
    return path.resolve(
      path.resolve(this._serverFolderPath, "../../../web"),
      innerPath
    );
  }
}

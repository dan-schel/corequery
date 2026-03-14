import express from "express";
import fsp from "fs/promises";
import path from "path";
import type { Corequery } from "@/server/corequery.js";
import { AssetPreparer } from "@/server/web-server/asset-preparer.js";
import type { AssetConfig } from "@/server/config/types/asset-config.js";
import { createApiRouter } from "@/server/api/create-api-router.js";

type ClientMode = "dist-folder" | "vite-middleware";

export class WebServer {
  private _frontendVersion: string | null;

  constructor(
    private readonly _app: Corequery,
    private readonly _port: number,
    private readonly _assetConfig: AssetConfig,
    private readonly _clientMode: ClientMode,
    private readonly _serverFolderPath: string,
  ) {
    // Not known until after prepareAssets() has run.
    this._frontendVersion = null;
  }

  async prepareAssets() {
    if (this._clientMode === "dist-folder") {
      const distFolderPath = this._getWebFolderPath("dist");

      const assetPreparer = new AssetPreparer(
        distFolderPath,
        this._assetConfig,
        this._app.getCorequeryPackageVersion(),
        this._app.serverVersion,
      );

      await assetPreparer.run();

      this._frontendVersion = assetPreparer.getFrontendVersion();
    } else {
      // It's hard to think of a way to reasonably replace the assets in
      // middleware mode, as you'd be replacing the source assets. It's only a
      // "nice to have" anyway, using the CoreQuery assets during demo-app
      // development is perfectly acceptable.

      this._frontendVersion = "dev";
    }
  }

  async start() {
    const server = express();
    server.use("/api", express.json(), createApiRouter(this._app));

    if (this._clientMode === "dist-folder") {
      await this._serveFrontendFromDistFolder(server);
    }
    if (this._clientMode === "vite-middleware") {
      await this._serveFrontendUsingViteMiddleware(server);
    }

    server.listen(this._port, () => {
      // TODO: Use proper logger.
      // eslint-disable-next-line no-console
      console.log(`Server ready (http://localhost:${this._port})!`);
    });
  }

  getFrontendVersion() {
    if (this._frontendVersion == null) {
      throw new Error("Call prepareAssets() first.");
    }
    return this._frontendVersion;
  }

  private async _serveFrontendFromDistFolder(server: express.Express) {
    server.use(express.static(this._getWebFolderPath("dist")));

    // The /reset page, which intentionally exists separately to the rest of the
    // Preact app, to help the user reset their service worker and local storage
    // if they get into a broken state.
    const resetHtmlPath = this._getWebFolderPath("dist/reset.html");
    const resetHtml = await fsp.readFile(resetHtmlPath, "utf-8");
    server.get("/reset", (_req, res) => {
      res.status(200).set({ "Content-Type": "text/html" }).end(resetHtml);
    });

    // Every other non-static-file & non-reset-page URL serves index.html, and
    // the Preact router takes care of showing the correct page or 404 page.
    const indexHtmlPath = this._getWebFolderPath("dist/index.html");
    const indexHtml = await fsp.readFile(indexHtmlPath, "utf-8");
    server.get("*all", (_req, res) => {
      res.status(200).set({ "Content-Type": "text/html" }).end(indexHtml);
    });
  }

  private async _serveFrontendUsingViteMiddleware(server: express.Express) {
    // TODO: Use proper logger.
    // eslint-disable-next-line no-console
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
      innerPath,
    );
  }
}

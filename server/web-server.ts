import express from "express";
import fsp from "fs/promises";
import path from "path";
import { createServer } from "vite";
import type { Corequery } from "./corequery.js";

export type WebServerArgs = {
  clientMode: "prebuilt" | "hot-reloading";
  port: number;
};

export class WebServer {
  constructor(
    private readonly _app: Corequery,
    private readonly _args: WebServerArgs,
    private readonly _serverFolderPath: string
  ) {}

  async start() {
    const server = express();

    // TODO: Implement APIs
    // server.use("/api", express.json(), createApiRouter(this._app));

    if (this._args.clientMode === "prebuilt") {
      await this._servePrebuiltFrontend(server);
    }
    if (this._args.clientMode === "hot-reloading") {
      await this._serveHotReloadingFrontend(server);
    }

    server.listen(this._args.port, () => {
      console.log(`Server ready (http://localhost:${this._args.port})!`);
    });
  }

  private async _servePrebuiltFrontend(server: express.Express) {
    const indexHtmlPath = this._getWebFolderPath("dist/index.html");
    const indexHtml = await fsp.readFile(indexHtmlPath, "utf-8");

    server.use(express.static(this._getWebFolderPath("dist")));

    server.use("*all", async (_req, res) => {
      res.status(200).set({ "Content-Type": "text/html" }).end(indexHtml);
    });
  }

  private async _serveHotReloadingFrontend(server: express.Express) {
    const vite = await createServer({
      server: { middlewareMode: true },
      root: this._getWebFolderPath(),
    });
    server.use(vite.middlewares);
  }

  private _getWebFolderPath(innerPath: string = "") {
    // TODO: This assumes we're running in <folder>/server/dist/server, and so
    // need three hops to find the web/ folder. Is it still true if we're
    // hot-reloading the server code?
    return path.resolve(
      path.resolve(this._serverFolderPath, "../../../web"),
      innerPath
    );
  }
}

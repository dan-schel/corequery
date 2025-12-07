import express from "express";
import fsp from "fs/promises";
import path from "path";
import { createServer } from "vite";
import type { Corequery } from "./corequery.js";

export const clientModes = ["dist-folder", "vite-middleware"] as const;
export type ClientMode = (typeof clientModes)[number];

export class WebServer {
  constructor(
    private readonly _app: Corequery,
    private readonly _port: number,
    private readonly _clientMode: ClientMode,
    private readonly _serverFolderPath: string
  ) {}

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

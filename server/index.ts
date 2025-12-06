import express from "express";
import { runSharedCode } from "../shared/example.js";
import { createServer } from "vite";
import fsp from "fs/promises";
import path from "path";

type Args = {
  clientMode: "prebuilt" | "hot-reloading";
  port: number;
};

export async function main(args: Args) {
  runSharedCode();
  startServer(args);
}

async function startServer(args: Args) {
  const server = express();

  // server.use("/api", express.json(), createApiRouter(app));

  if (args.clientMode === "prebuilt") servePrebuiltFrontend(server);
  if (args.clientMode === "hot-reloading") serveHotReloadingFrontend(server);

  server.listen(args.port, () => {
    console.log(`Server ready (http://localhost:${args.port})!`);
  });
}

async function servePrebuiltFrontend(server: express.Express) {
  const indexHtmlPath = getPathWithinWebFolder("dist/index.html");
  const indexHtml = await fsp.readFile(indexHtmlPath, "utf-8");

  server.use(express.static(getPathWithinWebFolder("dist")));

  server.use("*all", async (_req, res) => {
    res.status(200).set({ "Content-Type": "text/html" }).end(indexHtml);
  });
}

async function serveHotReloadingFrontend(server: express.Express) {
  const vite = await createServer({
    server: { middlewareMode: true },
    root: getPathWithinWebFolder(""),
  });
  server.use(vite.middlewares);
}

function getPathWithinWebFolder(innerPath: string) {
  // TODO: This assumes this file is <folder>/server/dist/server/index.js. Is it
  // still true if we're also hot-reloading the server code?
  return path.resolve(
    path.resolve(import.meta.dirname, "../../../web"),
    innerPath
  );
}

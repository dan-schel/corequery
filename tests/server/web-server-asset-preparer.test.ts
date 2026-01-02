import { describe, expect, it } from "vitest";
import { build } from "vite";
import { uuid } from "@dan-schel/js-utils";
import fsp from "fs/promises";
import path from "path";
import { WebServerAssetPreparer } from "../../server/web-server-asset-preparer.js";

describe("WebServerAssetPreparer", () => {
  it("works", async () => {
    const webDir = `web`;
    const outDir = `local/temp/${uuid()}`;
    const iconsDir = `tests/server/__support__/web-server-asset-preparer/icons`;

    // Vite has a neat `build.write = false` option which makes it run entirely
    // in-memory without writing to disk, but the PWA plugin doesn't support it,
    // so I have to do it this way anyway :(
    //
    // I have no idea why, but this doesn't build in production mode, i.e. the
    // sw.js file isn't minified. This has meant I've needed to tweak the regex
    // in the preparer to handle additional whitespace and quotes. It does work
    // if I do `NODE_ENV=production npm run test` though.
    await build({
      root: webDir,
      build: {
        outDir: path.relative(webDir, outDir),
      },
      logLevel: "silent",
    });

    const preparer = new WebServerAssetPreparer({
      appName: "CoreQuery Test App",
      shortAppName: "Test App",
      description: "This is a test app.",
      version: "1.2.3-test",
      faviconSvgPath: path.join(iconsDir, "favicon.svg"),
      appleTouchIconPngPath: path.join(iconsDir, "apple-touch-icon.png"),
      pwa192PngPath: path.join(iconsDir, "pwa-192x192.png"),
      pwa512PngPath: path.join(iconsDir, "pwa-512x512.png"),
      pwaMaskable192PngPath: path.join(iconsDir, "pwa-maskable-192x192.png"),
      pwaMaskable512PngPath: path.join(iconsDir, "pwa-maskable-512x512.png"),
    });

    await preparer.prepareDistFolder(outDir);

    async function readFile(filePath: string) {
      return await fsp.readFile(path.join(outDir, filePath), "utf-8");
    }

    expect(await readFile("index.html")).toMatchSnapshot();
    expect(await readFile("favicon.svg")).toMatchSnapshot();
    expect(await readFile("manifest.webmanifest")).toMatchSnapshot();
    expect(await readFile("sw.js")).toMatchSnapshot();

    await fsp.rm(outDir, { recursive: true, force: true });
  });
});

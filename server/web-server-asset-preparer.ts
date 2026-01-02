import path from "path";
import fsp from "fs/promises";
import { parse } from "node-html-parser";
import crypto from "crypto";

export type AssetConfig = {
  readonly appName: string;
  readonly shortAppName: string;
  readonly description: string;
  readonly version: string;

  readonly faviconSvgPath: string;
  readonly appleTouchIconPngPath: string;
  readonly pwa192PngPath: string;
  readonly pwa512PngPath: string;
  readonly pwaMaskable192PngPath: string;
  readonly pwaMaskable512PngPath: string;
};

export class WebServerAssetPreparer {
  constructor(private readonly _config: AssetConfig) {}

  async prepareDistFolder(distFolderPath: string) {
    const indexHtmlPath = path.join(distFolderPath, "index.html");
    const webManifestPath = path.join(distFolderPath, "manifest.webmanifest");

    await this._replaceIndexHtmlTags(indexHtmlPath);
    await this._replaceWebManifest(webManifestPath);
    await this._replaceIcons(distFolderPath);

    // Must come last, otherwise we'll calculate hashes before the file contents
    // are swapped.
    await this._replaceServiceWorkerRevisionHashes(distFolderPath);
  }

  private async _replaceWebManifest(filePath: string) {
    const manifestStr = await fsp.readFile(filePath, "utf-8");
    const manifestJson = JSON.parse(manifestStr);

    const newManifestJson = {
      ...manifestJson,
      name: this._config.appName,
      short_name: this._config.shortAppName,
      description: this._config.description,
    };

    const newManifestStr = JSON.stringify(newManifestJson);
    await fsp.writeFile(filePath, newManifestStr);
  }

  private async _replaceIndexHtmlTags(filePath: string) {
    const indexHtmlStr = await fsp.readFile(filePath, "utf-8");
    const indexHtml = parse(indexHtmlStr);

    function requireTag(selector: string) {
      const tag = indexHtml.querySelector(selector);
      if (tag == null) throw new Error(`"${selector}" tag not found.`);
      return tag;
    }

    const titleTag = requireTag("title");
    const descriptionTag = requireTag('meta[name="description"]');
    const appNameTag = requireTag('meta[name="corequery-app-name"]');
    const versionTag = requireTag('meta[name="corequery-frontend-version"]');

    titleTag.textContent = this._config.appName;
    descriptionTag.setAttribute("content", this._config.description);
    appNameTag.setAttribute("content", this._config.appName);
    versionTag.setAttribute("content", this._config.version);

    const newIndexHtmlStr = indexHtml.toString();
    await fsp.writeFile(filePath, newIndexHtmlStr);
  }

  private async _replaceIcons(distFolderPath: string) {
    const mapping = {
      "favicon.svg": this._config.faviconSvgPath,
      "apple-touch-icon.png": this._config.appleTouchIconPngPath,
      "pwa-192x192.png": this._config.pwa192PngPath,
      "pwa-512x512.png": this._config.pwa512PngPath,
      "pwa-maskable-192x192.png": this._config.pwaMaskable192PngPath,
      "pwa-maskable-512x512.png": this._config.pwaMaskable512PngPath,
    };

    for (const [fileName, sourcePath] of Object.entries(mapping)) {
      const destPath = path.join(distFolderPath, fileName);
      await fsp.copyFile(sourcePath, destPath);
    }
  }

  private async _replaceServiceWorkerRevisionHashes(distFolderPath: string) {
    const serviceWorkerPath = path.join(distFolderPath, "sw.js");
    const serviceWorkerStr = await fsp.readFile(serviceWorkerPath, "utf-8");

    // Any files this class modifies should be listed here.
    const filesRequiringRevisionUpdates = [
      "index.html",
      "manifest.webmanifest",
      "favicon.svg",
      "apple-touch-icon.png",
      "pwa-192x192.png",
      "pwa-512x512.png",
      "pwa-maskable-192x192.png",
      "pwa-maskable-512x512.png",
    ];

    const matches = Array.from(
      serviceWorkerStr.matchAll(
        /{\s*"?url"?:\s*"([^"]+)",\s*"?revision"?:\s*"[^"]+"\s*}/gm,
      ),
    ).map((match) => ({
      fullText: match[0],
      url: match[1],
    }));

    let newServiceWorkerStr = serviceWorkerStr;

    for (const file of filesRequiringRevisionUpdates) {
      // Filter, as some assets (e.g. pwa-192x192.png) are in there twice.
      const entries = matches.filter((m) => m.url === file);
      if (entries.length === 0) throw new Error(`"${file}" had no revisions.`);

      const fullFilePath = path.join(distFolderPath, file);
      const fileContent = await fsp.readFile(fullFilePath);
      const hash = crypto.createHash("md5").update(fileContent).digest("hex");

      for (const entry of entries) {
        newServiceWorkerStr = newServiceWorkerStr.replace(
          entry.fullText,
          `{url:"${entry.url}",revision:"${hash}"}`,
        );
      }
    }

    await fsp.writeFile(serviceWorkerPath, newServiceWorkerStr);
  }
}

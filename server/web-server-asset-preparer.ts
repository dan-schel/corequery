import path from "path";
import fsp from "fs/promises";
import { parse } from "node-html-parser";

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
    // Things to replace:
    //
    // - web/dist/index.html
    //   - <title>
    //   - <meta name="description">
    //
    // - web/dist/manifest.webmanifest
    //   - "name"
    //   - "short_name"
    //   - "description"
    //
    // - web/dist/favicon.svg
    //
    // - web/dist/apple-touch-icon.png
    //
    // - web/dist/pwa-192x192.png
    //
    // - web/dist/pwa-512x512.png
    //
    // - web/dist/pwa-maskable-192x192.png
    //
    // - web/dist/pwa-maskable-512x512.png

    const indexHtmlPath = path.join(distFolderPath, "index.html");
    const webManifestPath = path.join(distFolderPath, "manifest.webmanifest");

    await this._replaceIndexHtmlTags(indexHtmlPath);
    await this._replaceWebManifest(webManifestPath);
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

    const requireTag = (selector: string) => {
      const tag = indexHtml.querySelector(selector);
      if (tag == null) throw new Error(`${selector}" tag not found.`);
      return tag;
    };

    const titleTag = requireTag("title");
    const descriptionTag = requireTag('meta[name="description"]');
    const versionTag = requireTag('meta[name="corequery-frontend-version"]');

    titleTag.textContent = this._config.appName;
    descriptionTag.setAttribute("content", this._config.description);
    versionTag.setAttribute("content", this._config.version);

    const newIndexHtmlStr = indexHtml.toString();
    await fsp.writeFile(filePath, newIndexHtmlStr);
  }
}

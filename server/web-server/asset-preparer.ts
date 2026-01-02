import { IndexHtmlPreparer } from "./index-html-preparer.js";
import { WebManifestPreparer } from "./web-manifest-preparer.js";
import { IconPreparer } from "./icon-preparer.js";
import { ServiceWorkerPreparer } from "./service-worker-preparer.js";

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

export class AssetPreparer {
  constructor(private readonly _config: AssetConfig) {}

  async prepareDistFolder(distFolderPath: string) {
    await new IndexHtmlPreparer(distFolderPath, this._config).run();
    await new WebManifestPreparer(distFolderPath, this._config).run();
    await new IconPreparer(distFolderPath, this._config).run();

    // Must come last, otherwise we'll calculate hashes before the file contents
    // are swapped.
    await new ServiceWorkerPreparer(distFolderPath, [
      IndexHtmlPreparer.FILE_PATH,
      WebManifestPreparer.FILE_PATH,
      ...IconPreparer.FILE_PATHS,
    ]).run();
  }
}

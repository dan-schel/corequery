import { IndexHtmlPreparer } from "./index-html-preparer.js";
import { ManifestPreparer } from "./manifest-preparer.js";
import { IconsPreparer } from "./icons-preparer.js";
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
  static readonly ALL_MODIFIED_FILES = [
    IndexHtmlPreparer.FILE_PATH,
    ManifestPreparer.FILE_PATH,
    ...IconsPreparer.FILE_PATHS,
  ];

  private readonly _indexHtml: IndexHtmlPreparer;
  private readonly _manifest: ManifestPreparer;
  private readonly _icons: IconsPreparer;
  private readonly _serviceWorker: ServiceWorkerPreparer;

  constructor(
    private readonly _distFolderPath: string,
    private readonly _config: AssetConfig,
  ) {
    this._indexHtml = new IndexHtmlPreparer(this._distFolderPath, this._config);
    this._manifest = new ManifestPreparer(this._distFolderPath, this._config);
    this._icons = new IconsPreparer(this._distFolderPath, this._config);
    this._serviceWorker = new ServiceWorkerPreparer(this._distFolderPath, {
      filesReplaced: AssetPreparer.ALL_MODIFIED_FILES,
    });
  }

  async run() {
    await this._indexHtml.run();
    await this._manifest.run();
    await this._icons.run();
    await this._serviceWorker.run();
  }

  async validateDistFolder() {
    await this._indexHtml.validate();
    await this._manifest.validate();
    await this._icons.validate();
    await this._serviceWorker.validate();
  }
}

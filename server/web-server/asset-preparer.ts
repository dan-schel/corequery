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
  private static readonly ALL_MODIFIED_FILES = [
    IndexHtmlPreparer.FILE_PATH,
    WebManifestPreparer.FILE_PATH,
    ...IconPreparer.FILE_PATHS,
  ];

  private readonly _indexHtmlPreparer: IndexHtmlPreparer;
  private readonly _webManifestPreparer: WebManifestPreparer;
  private readonly _iconPreparer: IconPreparer;
  private readonly _serviceWorkerPreparer: ServiceWorkerPreparer;

  constructor(
    private readonly _distFolderPath: string,
    private readonly _config: AssetConfig,
  ) {
    this._indexHtmlPreparer = new IndexHtmlPreparer(
      this._distFolderPath,
      this._config,
    );
    this._webManifestPreparer = new WebManifestPreparer(
      this._distFolderPath,
      this._config,
    );
    this._iconPreparer = new IconPreparer(this._distFolderPath, this._config);
    this._serviceWorkerPreparer = new ServiceWorkerPreparer(
      this._distFolderPath,
      AssetPreparer.ALL_MODIFIED_FILES,
    );
  }

  async run() {
    await this._indexHtmlPreparer.run();
    await this._webManifestPreparer.run();
    await this._iconPreparer.run();
    await this._serviceWorkerPreparer.run();
  }

  async validateDistFolder() {
    await this._indexHtmlPreparer.validate();
    await this._webManifestPreparer.validate();
    await this._iconPreparer.validate();
    await this._serviceWorkerPreparer.validate();
  }
}

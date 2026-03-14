import { IndexHtmlPreparer } from "@/server/web-server/index-html-preparer.js";
import { ManifestPreparer } from "@/server/web-server/manifest-preparer.js";
import { IconsPreparer } from "@/server/web-server/icons-preparer.js";
import { ServiceWorkerPreparer } from "@/server/web-server/service-worker-preparer.js";
import type { AssetConfig } from "@/server/config/types/asset-config.js";

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

  private _frontendVersion: string | null;

  constructor(
    private readonly _distFolderPath: string,
    private readonly _config: AssetConfig,
    private readonly _corequeryPackageVersion: string,
    private readonly _serverVersion: string,
  ) {
    this._indexHtml = new IndexHtmlPreparer(this._distFolderPath, {
      ...this._config,
      corequeryPackageVersion: this._corequeryPackageVersion,
      serverVersion: this._serverVersion,
    });
    this._manifest = new ManifestPreparer(this._distFolderPath, this._config);
    this._icons = new IconsPreparer(this._distFolderPath, this._config);
    this._serviceWorker = new ServiceWorkerPreparer(this._distFolderPath, {
      filesReplaced: AssetPreparer.ALL_MODIFIED_FILES,
    });

    this._frontendVersion = null;
  }

  async run() {
    // Order of operations matters a lot here!

    // Step 1: Replace all the assets (with the exception of the `index.html`
    // file) which are gonna be pre-cached by the service worker, so that a
    // change to any of these would results in the PWA noticing an update is
    // available.
    await this._manifest.run();
    await this._icons.run();

    // Step 2: Now that the assets are replaced, we need to update the hashes
    // Vite generated in the `sw.js` file for these assets. Note that
    // `index.html` also has a hash in `sw.js`, but we haven't updated it yet.
    // This means the changes to `index.html` we're about to make won't result
    // in a changed hash.
    //
    // This is OK, because:
    //
    // - `appName` and `description` are also present in the manifest, so
    //   changes to those are covered by the `manifest.webmanifest` hash. This
    //   is kinda just good luck tbh, and if this wasn't the case we'd need to
    //   partially update `index.html` prior to this step!
    //
    // - `corequeryPackageVersion` and `serverVersion` changes do not
    //   necessarily indicate a frontend change, and therefore shouldn't
    //   themselves trigger a PWA update anyway.
    //
    // - Real frontend changes (i.e. changes to `index.html` content such as
    //   additional DOM content) occur at build time, not as part of the
    //   replacement step which is yet to occur.
    const frontendVersion = await this._serviceWorker.run();

    // Step 3: Now that we know the `frontendVersion`, we can update the
    // `index.html` file's meta tags.
    await this._indexHtml.run(frontendVersion);

    this._frontendVersion = frontendVersion;
  }

  async validateDistFolder() {
    await this._indexHtml.validate();
    await this._manifest.validate();
    await this._icons.validate();
    await this._serviceWorker.validate();
  }

  getFrontendVersion() {
    if (this._frontendVersion == null) throw new Error("Call run() first.");
    return this._frontendVersion;
  }
}

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

    // Step 1: Replace all the assets which are gonna be pre-cached by the
    // service worker (with the exception of a few fields in the `index.html`
    // file), so that a change to any of these would result in the PWA noticing
    // an update is available.
    await this._indexHtml.runPartial();
    await this._manifest.run();
    await this._icons.run();

    // Step 2: Now that the assets are replaced, we need to update the hashes
    // Vite generated in the `sw.js` file for these assets. Note that
    // `index.html` also has a hash in `sw.js`, but we haven't yet replaced some
    // of the meta tags.
    //
    // This is intentional, and here's why:
    //
    // - Real frontend changes (i.e. changes to `index.html` content such as
    //   additional DOM content) occur at build time, not as part of this
    //   replacement process, so they've already happened and will be factored
    //   into the new hash.
    //
    // - Likewise, `appName` and `description` have been substituted already,
    //   during the `runPartial()` method.
    //
    // - `corequeryPackageVersion` and `serverVersion` changes do not
    //   necessarily indicate a frontend change, and shouldn't themselves
    //   trigger a PWA update. Therefore, they SHOULDN'T be factored into the
    //   new hash.
    //
    // - We DO want any change to `frontendVersion` to cause the hash for
    //  `index.html` to change, because there is always meant to be a 1-to-1
    //   correlation between PWA updates, and `frontendVersion` changes.
    //   HOWEVER, we don't know the value for `frontendVersion` yet. It's
    //   calculated by hashing the content of `sw.js` after all inner hashes are
    //   replaced in this next step.
    const frontendVersion = await this._serviceWorker.run();

    // Step 3: Now that we know the `frontendVersion`, we'll replace the hash
    // for `index.html` in the service worker file with this `frontendVersion`
    // value.
    //
    // Because we calculate `frontendVersion` based on the content of `sw.js`
    // prior to this point, it means any changes to the following are accounted
    // for in the `frontendVersion` value:
    //
    // - the `index.html` file (excluding the three tags yet to be replaced)
    // - the `manifest.webmanifest` file
    // - any of the icons
    // - any of the JS/CSS files
    //
    // The ONLY things it doesn't account for are:
    //
    // - `corequeryPackageVersion`
    // - `serverVersion`
    //
    // And again, that's intentional. We don't want changes to these values to
    // be considered a frontend update.
    //
    // The `index.html` file ALSO has a meta tag for `frontendVersion` that
    // we haven't populated yet, but since it's literally the value used for the
    // hash, it means any change to that value causes the hash for `index.html`
    // to change anyway!
    //
    // Theoretically we could substitute in the value for `frontendVersion` and
    // recalculate the hash for `index.html` "properly", but then we'd still
    // need to substitute `corequeryPackageVersion` and `serverVersion` into the
    // `index.html` file afterwards to prevent them impacting the hash.
    //
    // Using the value of `frontendVersion` instead avoids three-stages of
    // substitution. Remember, since the previous content of `index.html` is
    // ALREADY FACTORED INTO the `frontendVersion` hash value, we're not losing
    // anything by replacing the hash like this.
    await this._replaceHashForIndexHtmlInServiceWorker(frontendVersion);

    // Step 4: Now that all hashes are finalised we can do the second stage of
    // substitution into the `index.html` file, for `frontendVersion`,
    // `corequeryPackageVersion`, and `serverVersion`.
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

  private async _replaceHashForIndexHtmlInServiceWorker(newHash: string) {
    await new ServiceWorkerPreparer(this._distFolderPath, {
      filesReplaced: [IndexHtmlPreparer.FILE_PATH],
      getFileHash: () => Promise.resolve(newHash),
    }).run();
  }
}

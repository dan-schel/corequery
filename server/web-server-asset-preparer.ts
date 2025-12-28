export type AssetConfig = {
  readonly appName: string;
  readonly shortAppName: string;
  readonly description: string;

  readonly faviconSvgPath: string;
  readonly appleTouchIconPngPath: string;
  readonly pwa192PngPath: string;
  readonly pwa512PngPath: string;
  readonly pwaMaskable192PngPath: string;
  readonly pwaMaskable512PngPath: string;
};

export class WebServerAssetPreparer {
  constructor(private readonly _config: AssetConfig) {}

  async prepareDistFolder() {
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
  }
}

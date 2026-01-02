import path from "path";
import fsp from "fs/promises";

type Config = {
  readonly faviconSvgPath: string;
  readonly appleTouchIconPngPath: string;
  readonly pwa192PngPath: string;
  readonly pwa512PngPath: string;
  readonly pwaMaskable192PngPath: string;
  readonly pwaMaskable512PngPath: string;
};

export class IconPreparer {
  public static readonly FILE_PATHS = [
    "favicon.svg",
    "apple-touch-icon.png",
    "pwa-192x192.png",
    "pwa-512x512.png",
    "pwa-maskable-192x192.png",
    "pwa-maskable-512x512.png",
  ] as const;

  constructor(
    private readonly _distFolderPath: string,
    private readonly _config: Config,
  ) {}

  async run() {
    const mapping: Record<(typeof IconPreparer.FILE_PATHS)[number], string> = {
      "favicon.svg": this._config.faviconSvgPath,
      "apple-touch-icon.png": this._config.appleTouchIconPngPath,
      "pwa-192x192.png": this._config.pwa192PngPath,
      "pwa-512x512.png": this._config.pwa512PngPath,
      "pwa-maskable-192x192.png": this._config.pwaMaskable192PngPath,
      "pwa-maskable-512x512.png": this._config.pwaMaskable512PngPath,
    };

    for (const [fileName, sourcePath] of Object.entries(mapping)) {
      const destPath = path.join(this._distFolderPath, fileName);
      await fsp.copyFile(sourcePath, destPath);
    }
  }

  async validate() {
    for (const fileName of IconPreparer.FILE_PATHS) {
      const destPath = path.join(this._distFolderPath, fileName);
      await fsp.access(destPath);
    }
  }
}

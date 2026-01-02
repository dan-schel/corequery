import path from "path";
import fsp from "fs/promises";
import crypto from "crypto";

type Config = {
  filesReplaced: readonly string[];
  getFileHash?: (filePath: string) => Promise<string>;
};

export class ServiceWorkerPreparer {
  static readonly FILE_PATH = "sw.js";

  constructor(
    private readonly _distFolderPath: string,
    private readonly _config: Config,
  ) {}

  async run() {
    await fsp.writeFile(this._fullFilePath(), await this.getReplacedContent());
  }

  async getReplacedContent() {
    const { serviceWorkerStr, substringsPerFile } =
      await this._getSubstringsToReplace();

    let newServiceWorkerStr = serviceWorkerStr;

    for (const { file, substrings } of substringsPerFile) {
      const hash = await this._getFileHash(file);

      for (const substring of substrings) {
        newServiceWorkerStr = newServiceWorkerStr.replace(
          substring,
          `{url:"${file}",revision:"${hash}"}`,
        );
      }
    }

    return newServiceWorkerStr;
  }

  async validate() {
    // If this passes without error, we've found everything we're looking for in
    // the sw.js.
    await this._getSubstringsToReplace();
  }

  private async _getFileHash(filePath: string) {
    if (this._config.getFileHash != null) {
      return this._config.getFileHash(filePath);
    } else {
      const fullFilePath = path.join(this._distFolderPath, filePath);
      const fileContent = await fsp.readFile(fullFilePath);
      return crypto.createHash("md5").update(fileContent).digest("hex");
    }
  }

  private async _getSubstringsToReplace() {
    const serviceWorkerStr = await fsp.readFile(this._fullFilePath(), "utf-8");

    const allMatches = Array.from(
      serviceWorkerStr.matchAll(/{url:"([^"]+)",revision:"[^"]+"}/g),
    ).map((match) => ({
      fullText: match[0],
      url: match[1],
    }));

    const substringsPerFile = this._config.filesReplaced.map((file) => {
      // Filter, as some assets (e.g. pwa-192x192.png) are in there twice.
      const substrings = allMatches
        .filter((m) => m.url === file)
        .map((m) => m.fullText);

      if (substrings.length === 0) {
        throw new Error(`Cannot find "${file}" revision in service worker.`);
      }

      return { file, substrings };
    });

    return { serviceWorkerStr, substringsPerFile };
  }

  private _fullFilePath() {
    return path.join(this._distFolderPath, ServiceWorkerPreparer.FILE_PATH);
  }
}

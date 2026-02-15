import fsp from "fs/promises";
import path from "path";
import z from "zod";

type Config = {
  readonly appName: string;
  readonly shortAppName: string;
  readonly description: string;
};

export class ManifestPreparer {
  static readonly FILE_PATH = "manifest.webmanifest";

  constructor(
    private readonly _distFolderPath: string,
    private readonly _config: Config,
  ) {}

  async run() {
    await fsp.writeFile(this._fullFilePath(), await this.getReplacedContent());
  }

  async getReplacedContent() {
    const manifest = await this._readManifestJson();

    const newManifest = {
      ...manifest,
      name: this._config.appName,
      short_name: this._config.shortAppName,
      description: this._config.description,
    };

    return JSON.stringify(newManifest);
  }

  async validate() {
    // If this passes without error, we've found everything we're looking for in
    // the manifest.webmanifest.
    await this._readManifestJson();
  }

  private async _readManifestJson() {
    const manifestStr = await fsp.readFile(this._fullFilePath(), "utf-8");

    const schema = z.object({
      name: z.string(),
      short_name: z.string(),
      description: z.string(),
    });

    return schema.parse(JSON.parse(manifestStr));
  }

  private _fullFilePath() {
    return path.join(this._distFolderPath, ManifestPreparer.FILE_PATH);
  }
}

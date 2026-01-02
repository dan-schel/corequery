import fsp from "fs/promises";
import path from "path";
import { parse } from "node-html-parser";

type Config = {
  readonly appName: string;
  readonly shortAppName: string;
  readonly description: string;
  readonly version: string;
};

export class IndexHtmlPreparer {
  static readonly FILE_PATH = "index.html";

  constructor(
    private readonly _distFolderPath: string,
    private readonly _config: Config,
  ) {}

  async run() {
    await fsp.writeFile(this._fullFilePath(), await this.getReplacedContent());
  }

  async getReplacedContent() {
    const tags = await this._readTags();

    tags.title.textContent = this._config.appName;
    tags.description.setAttribute("content", this._config.description);
    tags.appName.setAttribute("content", this._config.appName);
    tags.frontendVersion.setAttribute("content", this._config.version);

    return tags.indexHtml.toString();
  }

  async validate() {
    // If this passes without error, we've found everything we're looking for in
    // the index.html.
    await this._readTags();
  }

  private async _readTags() {
    const indexHtmlStr = await fsp.readFile(this._fullFilePath(), "utf-8");
    const indexHtml = parse(indexHtmlStr);

    function requireTag(selector: string) {
      const tag = indexHtml.querySelector(selector);
      if (tag == null) throw new Error(`"${selector}" tag not found.`);
      return tag;
    }

    return {
      indexHtml,
      title: requireTag("title"),
      description: requireTag('meta[name="description"]'),
      appName: requireTag('meta[name="corequery-app-name"]'),
      frontendVersion: requireTag('meta[name="corequery-frontend-version"]'),
    };
  }

  private _fullFilePath() {
    return path.join(this._distFolderPath, IndexHtmlPreparer.FILE_PATH);
  }
}

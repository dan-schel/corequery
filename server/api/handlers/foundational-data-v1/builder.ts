import crypto from "crypto";
import type { FOUNDATIONAL_DATA_V1 } from "@/shared/apis/index.js";
import type { Corequery } from "@/server/corequery.js";
import type { ResultOf } from "@/shared/apis/types.js";

type Result = ResultOf<typeof FOUNDATIONAL_DATA_V1>;
type ResultWithoutMetadata = Omit<Result, "metadata">;

export class FoundationalDataV1Builder {
  constructor(private readonly _app: Corequery) {}

  build(): Result {
    const resultWithoutMetadata = this._buildWithoutMetadata();

    // At the time of writing, this._app.version would be an effective hash (at
    // least in prod) because no part of the foundational data is dynamic, so
    // would only change due to a commit. But this hash mechanism exists to
    // future-proof against dynamic foundational data (and also make the dev
    // environment work, since in dev this._app.version won't be set).
    const hash = crypto
      .createHash("sha256")
      .update(this._app.version + JSON.stringify(resultWithoutMetadata))
      .digest("hex");

    return {
      ...resultWithoutMetadata,
      metadata: {
        hash: hash,
        serverVersion: this._app.version,
      },
    };
  }

  private _buildWithoutMetadata(): ResultWithoutMetadata {
    return {
      stops: this._app.stops.map((s) => s.toFoda()),
      lines: this._app.lines.map((l) => l.toFoda()),
      landingPage: {
        primaryMarkdown: this._app.landingPageConfig.primaryMarkdown,
      },
      footer: {
        primaryMarkdown: this._app.footerConfig.primaryMarkdown,
      },
    };
  }
}

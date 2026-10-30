import crypto from "crypto";
import type { Corequery } from "@/server/corequery.js";
import type { fodaSchema } from "@/shared/apis/foundational-data/v1/foundational-data.js";
import type z from "zod";

type Result = z.input<typeof fodaSchema>;
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
      .update(this._app.serverVersion + JSON.stringify(resultWithoutMetadata))
      .digest("hex");

    return {
      ...resultWithoutMetadata,
      metadata: {
        // TODO: The hash must be the same from different versions of the FODA
        // API for the same FODA. This means we have to calculate the hash
        // outside this class, on the full range of data which could possibly
        // affect the hash.
        //
        // I think that means, this._app needs to be capable of creating version
        // agnostic FODA value. We generate the hash based on it, then pass it
        // along to this class to transform it into the structure the V1 API
        // supports (the v2 API would structure it differently).
        //
        // We could have Stop#toFodaDto(), and that Foda Dto stores a JSON
        // object, and has .toFodaV1(), .toFodaV2(), etc. methods which can
        // only pull data from the JSON representation. Then it has
        // .toHashValue() which returns the raw JSON object for hashing
        // purposes.
        //
        // It has to be this way, otherwise an outdated client will fetch the
        // FODA from the v1 API, getting one hash, and then later calling a
        // FODA-synced API endpoint which (a) doesn't know which hash to use,
        // and (b) if it just decides to use the hash from the latest version of
        // the FODA API, it'll keep telling that client that it needs to update
        // its FODA, but the client will never succeed as the hash will always
        // differ.
        hash: hash,
        fodaApiVersion: "1",
        serverVersion: this._app.serverVersion,
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
      terminology: {
        stop: this._app.terminologyConfig.stop,
        line: this._app.terminologyConfig.line,
        service: this._app.terminologyConfig.service,
      },
    };
  }
}

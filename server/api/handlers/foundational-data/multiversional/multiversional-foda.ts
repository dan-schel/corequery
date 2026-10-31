import crypto from "crypto";
import type { Corequery } from "@/server/corequery.js";
import { MultiversionalLineFoda } from "@/server/api/handlers/foundational-data/multiversional/multiversional-line-foda.js";
import { MultiversionalStopFoda } from "@/server/api/handlers/foundational-data/multiversional/multiversional-stop-foda.js";
import type { fodaSchema as fodaV1Schema } from "@/shared/apis/foundational-data/v1/foundational-data.js";
import type z from "zod";

// This class exists because the `hash` value returned for FODA must remain
// identical across different versions of the FODA API for the same FODA. This
// means we have to calculate the hash based on a shared, version-agnostic
// representation of the FODA (called obj in here), which contains the full
// range of data which could possibly affect the hash (i.e., the union of the
// fields used by all versions of the FODA API)
//
// It has to be this way, otherwise an outdated client will fetch the FODA from
// the v1 API, getting one hash calculated from the v1 data, and then later
// calling a FODA-synced API endpoint which (a) can't calculate a hash unless it
// chooses which version to calculate the hash from, and (b) if it just decides
// to use the hash from the latest version of the FODA API, it'll keep telling
// that client that it needs to update its FODA, but the client will never
// succeed as it only knows how to call the v1 API, so the hash will always
// differ.

export class MultiversionalFoda {
  readonly hash: string;

  // The obj which will ultimately be used to calculate the hash is the ONLY
  // allowable input for this class. Methods like `toFodaV1` cannot be allowed
  // to use anything else as an input, otherwise values which should be
  // considered during hash calculation will be missed.
  constructor(readonly obj: ReturnType<typeof MultiversionalFoda._buildObj>) {
    // Notice how this is not versioned. Every version of the FODA API, and all
    // FODA-synced APIs return the same hash. This means a client won't get
    // conflicting results from whichever FODA API version it's configured to
    // call vs when it gets the hash back from a FODA-synced API.
    this.hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(this.obj))
      .digest("hex");
  }

  static build(app: Corequery) {
    return new MultiversionalFoda(MultiversionalFoda._buildObj(app));
  }

  // TODO: Do something to enforce that the return type of `_buildObj` is a
  // plain object (i.e. doesn't contain any class instances or other
  // non-serializable values). I remember doing something in ItIsBuses that did
  // this (a `JsonSerializable` type or something).
  private static _buildObj(app: Corequery) {
    return {
      // TODO: Can I remember the rationale behind having serverVersion in the
      // hash calculation? Was it just so foda.metadata.serverVersion remains up
      // to date on the frontend?
      //
      // If so, does it need to? I'm pretty sure server version is baked into
      // the PWA too, and I intentionally let it drift if the PWA bundle doesn't
      // actually change. It's kinda cool in that way, to see that the frontend
      // didn't need to change just because the server was updated (is server
      // version the trainquery-melbourne commit hash?).
      //
      // Any material changes to FODA should be reflected in this obj, and
      // therefore the hash, without needing serverVersion to drive it.
      //
      // If I decide to remove it, make serverVersion an arg on toFodaV1
      // instead.
      serverVersion: app.serverVersion,

      stops: app.stops.map((s) => MultiversionalStopFoda.build(s).obj),
      lines: app.lines.map((l) => MultiversionalLineFoda.build(l).obj),
      landingPage: {
        primaryMarkdown: app.landingPageConfig.primaryMarkdown,
      },
      footer: {
        primaryMarkdown: app.footerConfig.primaryMarkdown,
      },
      terminology: {
        stop: app.terminologyConfig.stop,
        line: app.terminologyConfig.line,
        service: app.terminologyConfig.service,
      },
    };
  }

  toFodaV1(hash: string): z.input<typeof fodaV1Schema> {
    return {
      metadata: {
        hash,
        fodaApiVersion: "1",
        serverVersion: this.obj.serverVersion,
      },

      stops: this.obj.stops.map((s) =>
        new MultiversionalStopFoda(s).toFodaV1(),
      ),
      lines: this.obj.lines.map((l) =>
        new MultiversionalLineFoda(l).toFodaV1(),
      ),
      landingPage: {
        primaryMarkdown: this.obj.landingPage.primaryMarkdown,
      },
      footer: {
        primaryMarkdown: this.obj.footer.primaryMarkdown,
      },
      terminology: {
        stop: this.obj.terminology.stop,
        line: this.obj.terminology.line,
        service: this.obj.terminology.service,
      },
    };
  }

  // Later: Implement toFodaV2. The union of data required as an input to either
  // toFodaV1 or toFodaV2 should be included in `obj` so that both APIs always
  // return the same hash, and even a change in a field that only v2 uses (or
  // vice versa) causes a change to that hash.
}

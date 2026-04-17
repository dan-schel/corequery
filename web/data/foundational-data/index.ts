import { fodaSchema } from "@/shared/apis/foundational-data/v1/foundational-data";
import type z from "zod";

export class FoundationalData {
  constructor(private readonly _raw: z.infer<typeof fodaSchema>) {}

  get hash() {
    return this._raw.metadata.hash;
  }

  get serverVersion() {
    return this._raw.metadata.serverVersion;
  }

  get footerPrimaryMarkdown() {
    return this._raw.footer.primaryMarkdown;
  }

  get stops() {
    // I'm sure in future we'll want to make these fully fledged classes, but
    // this is enough for now.
    return this._raw.stops;
  }

  get lines() {
    // I'm sure in future we'll want to make these fully fledged classes, but
    // this is enough for now.
    return this._raw.lines;
  }

  get terminology() {
    return this._raw.terminology;
  }

  get landingPage() {
    return this._raw.landingPage;
  }

  static readonly json = fodaSchema.transform((x) => new FoundationalData(x));

  toJson(): z.input<typeof fodaSchema> {
    return this._raw;
  }
}

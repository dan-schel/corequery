import { fodaSchema } from "@/shared/apis/foundational-data/v1/foundational-data";
import type z from "zod";
import { FodaStopCollection } from "@/web/data/foundational-data/foda-stop-collection";
import { FodaLineCollection } from "@/web/data/foundational-data/foda-line-collection";

export class FoundationalData {
  readonly stops: FodaStopCollection;
  readonly lines: FodaLineCollection;

  constructor(private readonly _raw: z.infer<typeof fodaSchema>) {
    this.stops = new FodaStopCollection(_raw.stops);
    this.lines = new FodaLineCollection(_raw.lines);
  }

  get hash() {
    return this._raw.metadata.hash;
  }

  get serverVersion() {
    return this._raw.metadata.serverVersion;
  }

  get footerPrimaryMarkdown() {
    return this._raw.footer.primaryMarkdown;
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

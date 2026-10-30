import { fodaSchema } from "@/shared/apis/foundational-data/v1/foundational-data";
import type z from "zod";
import { FodaStopCollection } from "@/web/data/foundational-data/foda-stop-collection";
import { FodaLineCollection } from "@/web/data/foundational-data/foda-line-collection";

export class FoundationalData {
  readonly stops: FodaStopCollection;
  readonly lines: FodaLineCollection;

  constructor(private readonly _obj: z.infer<typeof fodaSchema>) {
    this.stops = new FodaStopCollection(_obj.stops);
    this.lines = new FodaLineCollection(_obj.lines);
  }

  static readonly json = fodaSchema.transform((x) => new FoundationalData(x));

  get hash() {
    return this._obj.metadata.hash;
  }

  get fodaApiVersion() {
    return this._obj.metadata.fodaApiVersion;
  }

  get serverVersion() {
    return this._obj.metadata.serverVersion;
  }

  get footerPrimaryMarkdown() {
    return this._obj.footer.primaryMarkdown;
  }

  get terminology() {
    return this._obj.terminology;
  }

  get landingPage() {
    return this._obj.landingPage;
  }
}

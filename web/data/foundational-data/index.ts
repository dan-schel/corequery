import { fodaSchema } from "@/shared/apis/foundational-data/v1/foundational-data";
import type z from "zod";

export class FoundationalData {
  constructor(private readonly _raw: z.infer<typeof fodaSchema>) {}

  get hash() {
    return this._raw.metadata.hash;
  }

  static readonly json = fodaSchema.transform((x) => new FoundationalData(x));

  toJson(): z.input<typeof fodaSchema> {
    return this._raw;
  }
}

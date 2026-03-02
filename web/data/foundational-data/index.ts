import { FOUNDATIONAL_DATA_V1 } from "@/shared/apis";
import type { ResultOf } from "@/shared/apis/types";
import type z from "zod";

const currentApiVersion = FOUNDATIONAL_DATA_V1;

export class FoundationalData {
  constructor(private readonly _raw: ResultOf<typeof currentApiVersion>) {}

  get hash() {
    return this._raw.metadata.hash;
  }

  static readonly json = currentApiVersion.resultSchema.transform(
    (x) => new FoundationalData(x),
  );

  toJson(): z.input<typeof currentApiVersion.resultSchema> {
    return this._raw;
  }
}

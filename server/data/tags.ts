import type { TagSuccessionConfig } from "../config/index.js";

export class Tags {
  constructor(private readonly _tags: Set<number>) {}

  has(tag: number): boolean {
    return this._tags.has(tag);
  }

  static build(
    explicitTags: readonly number[],
    tagSuccessionConfig: TagSuccessionConfig,
  ): Tags {
    const tags = new Set<number>(explicitTags);

    let runAgain = true;
    while (runAgain) {
      runAgain = false;
      for (const tag of tags) {
        const successorTags = tagSuccessionConfig[tag] ?? [];
        for (const succTag of successorTags) {
          if (!tags.has(succTag)) {
            tags.add(succTag);
            runAgain = true;
          }
        }
      }
    }

    return new Tags(tags);
  }
}

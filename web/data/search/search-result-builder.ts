import type { SearchCandidate } from "@/web/data/search/types";

export class SearchResultBuilder<T> {
  private readonly _results: Map<string, T>;
  private readonly _candidatesNotRequiringExactMatch: readonly SearchCandidate<T>[];

  constructor(
    private readonly _query: string,
    private readonly _candidates: readonly SearchCandidate<T>[],
    private readonly _maxResults: number,
  ) {
    this._results = new Map();
    this._candidatesNotRequiringExactMatch = _candidates.filter(
      (c) => !(c.requiresExactMatch ?? false),
    );
  }

  getResults() {
    return Array.from(this._results.values()).slice(0, this._maxResults);
  }

  appendResults(
    func: (
      query: string,
      candidates: readonly SearchCandidate<T>[],
    ) => SearchCandidate<T>[],
    { passCandidatesRequiringExactMatch = false } = {},
  ) {
    if (this._results.size >= this._maxResults) return;

    const candidatesToPass = passCandidatesRequiringExactMatch
      ? this._candidates
      : this._candidatesNotRequiringExactMatch;

    const funcResults = func(this._query, candidatesToPass);

    for (const result of funcResults) {
      if (this._results.has(result.id)) continue;
      this._results.set(result.id, result.data);
    }
  }
}

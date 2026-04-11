import { nonNull } from "@dan-schel/js-utils";
import type { SearchCandidate } from "@/web/data/search/types";

export function getAlternativeSubstringMatches<T>(
  query: string,
  candidates: readonly SearchCandidate<T>[],
): SearchCandidate<T>[] {
  return candidates
    .map((candidate) => {
      const matches = candidate.alternatives.filter((a) => a.includes(query));
      const bestMatch = matches.sort((a, b) => a.length - b.length)[0];
      if (bestMatch == null) return null;

      return {
        candidate,
        bestMatch,
        percentageMatched: query.length / bestMatch.length,
      };
    })
    .filter(nonNull)
    .sort((a, b) => b.percentageMatched - a.percentageMatched)
    .map(({ candidate }) => candidate);
}

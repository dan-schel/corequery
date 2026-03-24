import type { SearchCandidate } from "@/web/components/search/algorithm/types";

export function getPrimaryPrefixMatches<T>(
  query: string,
  candidates: readonly SearchCandidate<T>[],
): SearchCandidate<T>[] {
  return candidates
    .filter((candidate) => candidate.primary.startsWith(query))
    .sort((a, b) => a.primary.length - b.primary.length);
}

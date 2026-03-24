import type { SearchCandidate } from "@/web/components/search/algorithm/types";

export function getExactMatches<T>(
  query: string,
  candidates: readonly SearchCandidate<T>[],
): SearchCandidate<T>[] {
  return candidates.filter(
    (candidate) =>
      candidate.primary === query || candidate.alternatives.includes(query),
  );
}

import type { SearchCandidate } from "@/web/components/search/algorithm/types";
import { SearchResultBuilder } from "@/web/components/search/algorithm/search-result-builder";
import { getExactMatches } from "@/web/components/search/algorithm/subalgorithms/exact-matches";
import { getPrimaryPrefixMatches } from "@/web/components/search/algorithm/subalgorithms/primary-prefix-matches";
import { getAlternativePrefixMatches } from "@/web/components/search/algorithm/subalgorithms/alternatives-prefix-matches";

export function search<T>(
  query: string,
  candidates: readonly SearchCandidate<T>[],
  { maxResults = 5 } = {},
): SearchCandidate<T>[] {
  const builder = new SearchResultBuilder(query, candidates, maxResults);

  builder.appendResults(getExactMatches, {
    passCandidatesRequiringExactMatch: true,
  });
  builder.appendResults(getPrimaryPrefixMatches);
  builder.appendResults(getAlternativePrefixMatches);

  return builder.getResults();
}

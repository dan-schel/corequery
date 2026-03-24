import type { SearchCandidate } from "@/web/components/search/algorithm/types";
import { SearchResultBuilder } from "@/web/components/search/algorithm/search-result-builder";
import { getExactMatches } from "@/web/components/search/algorithm/subalgorithms/exact-matches";
import { getPrimaryPrefixMatches } from "@/web/components/search/algorithm/subalgorithms/primary-prefix-matches";
import { getAlternativePrefixMatches } from "@/web/components/search/algorithm/subalgorithms/alternatives-prefix-matches";
import { getPrimarySubstringMatches } from "@/web/components/search/algorithm/subalgorithms/primary-substring-matches";
import { getAlternativeSubstringMatches } from "@/web/components/search/algorithm/subalgorithms/alternatives-substring-matches";

export function search<T>(
  query: string,
  candidates: readonly SearchCandidate<T>[],
  { maxResults = 5 } = {},
): T[] {
  const processedQuery = query.trim().toLowerCase();
  if (processedQuery.length === 0) return [];

  const processedCandidates = candidates.map((candidate) => ({
    ...candidate,
    primary: candidate.primary.toLowerCase(),
    alternatives: candidate.alternatives.map((a) => a.toLowerCase()),
  }));

  const builder = new SearchResultBuilder(
    query,
    processedCandidates,
    maxResults,
  );

  builder.appendResults(getExactMatches, {
    passCandidatesRequiringExactMatch: true,
  });
  builder.appendResults(getPrimaryPrefixMatches);
  builder.appendResults(getPrimarySubstringMatches);
  builder.appendResults(getAlternativePrefixMatches);
  builder.appendResults(getAlternativeSubstringMatches);

  return builder.getResults();
}

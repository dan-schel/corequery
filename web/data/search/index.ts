import type { SearchCandidate } from "@/web/data/search/types";
import { SearchResultBuilder } from "@/web/data/search/search-result-builder";
import { getExactMatches } from "@/web/data/search/subalgorithms/exact-matches";
import { getPrimaryPrefixMatches } from "@/web/data/search/subalgorithms/primary-prefix-matches";
import { getPrimarySubstringMatches } from "@/web/data/search/subalgorithms/primary-substring-matches";
import { getAlternativePrefixMatches } from "@/web/data/search/subalgorithms/alternatives-prefix-matches";
import { getAlternativeSubstringMatches } from "@/web/data/search/subalgorithms/alternatives-substring-matches";

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
    processedQuery,
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

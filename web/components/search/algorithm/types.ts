export type SearchCandidate<T> = {
  id: string;
  primary: string;
  alternatives: string[];
  data: T;
  requiresExactMatch?: boolean;
};

import clsx from "clsx";
import { Column } from "@/web/components/core/Column";
import type { SearchCandidate } from "@/web/components/search/algorithm/types";
import { useCallback, useMemo } from "preact/hooks";
import { search } from "@/web/components/search/algorithm";
import { Fragment, type ComponentChildren } from "preact";
import { TextBlock } from "../core/TextBlock";

type SearchResultButton<T> = (props: {
  result: T;
  onClick?: () => void;
}) => ComponentChildren;

type SearchResultsProps<T> = {
  class?: string;
  query: string;
  candidates: readonly SearchCandidate<T>[];
  buttonComponent: SearchResultButton<T>;
  onResultClick?: (result: T) => void;
  maxResults?: number;
  noResultsContent: ComponentChildren | null;
};

export function SearchResults<T>(props: SearchResultsProps<T>) {
  const { query, candidates, buttonComponent, onResultClick, maxResults } =
    props;

  const componentify = useCallback(
    (result: T, index: number) => {
      const onClick =
        onResultClick != null ? () => onResultClick(result) : undefined;
      return (
        <Fragment key={index}>{buttonComponent({ result, onClick })}</Fragment>
      );
    },
    [buttonComponent, onResultClick],
  );

  const results = useMemo(
    () => search(query, candidates, { maxResults }).map(componentify),
    [query, candidates, maxResults, componentify],
  );

  return (
    <Column class={clsx(props.class)}>
      {results}
      {results.length === 0 && props.noResultsContent}
    </Column>
  );
}

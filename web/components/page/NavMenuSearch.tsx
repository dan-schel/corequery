import clsx from "clsx";
import { Column } from "@/web/components/core/Column";
import { SearchResults } from "@/web/components/search/SearchResults";
import {
  usePageSearchCandidates,
  type PageSearchCandidateData,
} from "@/web/hooks/use-page-search-candidates";
import { useEffect, useState } from "preact/hooks";
import { Button } from "@/web/components/button/Button";

type NavMenuSearchProps = {
  class?: string;
  menuFullyClosed: boolean;
};

export function NavMenuSearch(props: NavMenuSearchProps) {
  const [query, setQuery] = useState("");
  const candidates = usePageSearchCandidates();

  useEffect(() => {
    if (props.menuFullyClosed) {
      setQuery("");
    }
  }, [props.menuFullyClosed]);

  return (
    <Column class={clsx(props.class)}>
      <input
        value={query}
        onInput={(e) =>
          setQuery(
            e.target != null &&
              "value" in e.target &&
              typeof e.target.value === "string"
              ? e.target.value
              : "",
          )
        }
      />
      <SearchResults
        query={query}
        candidates={candidates}
        buttonComponent={SearchResult}
      />
    </Column>
  );
}

type SearchResultProps = {
  result: PageSearchCandidateData;
};

function SearchResult(props: SearchResultProps) {
  return (
    <Button
      text={props.result.name}
      href={props.result.url}
      theme="hover-square"
      layout="menu-item"
    />
  );
}

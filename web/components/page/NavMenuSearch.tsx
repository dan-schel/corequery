import clsx from "clsx";
import { Column } from "@/web/components/core/Column";
import { SearchResults } from "@/web/components/search/SearchResults";
import {
  usePageSearch,
  type PageSearchCandidateData,
} from "@/web/hooks/use-page-search";
import { useEffect, useState } from "preact/hooks";
import { Button } from "@/web/components/button/Button";
import { Input } from "@/web/components/core/Input";
import { Grid } from "@/web/components/core/Grid";
import { MingcuteSearch2Line } from "@/web/components/icons/MingcuteSearch2Line";
import { Divider } from "@/web/components/core/Divider";
import { TextBlock } from "@/web/components/core/TextBlock";

type NavMenuSearchProps = {
  class?: string;
  menuFullyClosed: boolean;
};

export function NavMenuSearch(props: NavMenuSearchProps) {
  const [query, setQuery] = useState("");
  const { candidates, placeholder } = usePageSearch();

  useEffect(() => {
    if (props.menuFullyClosed) {
      setQuery("");
    }
  }, [props.menuFullyClosed]);

  return (
    <Column class={clsx(props.class, "gap-2")}>
      <Grid class="relative">
        <Input
          value={query}
          onChange={setQuery}
          class="px-4 pl-11 h-8"
          placeholder={placeholder}
        />
        <MingcuteSearch2Line class="absolute left-4 top-[50%] translate-y-[-50%] pointer-events-none text-fg-weak text-lg" />
      </Grid>
      <Divider />
      <SearchResults
        query={query}
        candidates={candidates}
        buttonComponent={SearchResult}
        noResultsContent={
          <Grid class="h-10 items-center">
            <TextBlock class="px-4" style="weak">
              No results.
            </TextBlock>
          </Grid>
        }
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
      icon={props.result.icon}
      theme="hover-square"
      layout="menu-item"
    />
  );
}

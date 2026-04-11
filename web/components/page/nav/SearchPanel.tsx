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
import { PageCenterer } from "@/web/components/page/PageCenterer";
import { TextBlock } from "@/web/components/core/TextBlock";
import { useActivationDelay } from "@/web/hooks/use-activation-delay";

type SearchPanelProps = {
  class?: string;
  open: boolean;
};

export function SearchPanel(props: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const { candidates, placeholder } = usePageSearch();
  const panelFullyClosed = useActivationDelay(!props.open, 300);

  useEffect(() => {
    if (panelFullyClosed) {
      setQuery("");
    }
  }, [panelFullyClosed]);

  return (
    <div
      class={clsx(
        props.class,
        "relative transition-[opacity,visibility,translate] duration-100",
        {
          "invisible": !props.open,
          "opacity-0": !props.open,
          "-translate-y-4": !props.open,
        },
      )}
    >
      <div class="absolute top-0 bottom-0 left-0 right-0 bg-bg-raised border-b border-soft-border opacity-95" />
      <PageCenterer class="relative z-1">
        <Column>
          <Grid class="relative py-2 border-b border-b-soft-border not-desktop:bg-bg-navbar">
            <Input
              value={query}
              onChange={setQuery}
              class="px-4 pl-11 h-8"
              placeholder={placeholder}
            />
            <MingcuteSearch2Line class="absolute left-4 top-[50%] translate-y-[-50%] pointer-events-none text-fg-weak text-lg" />
          </Grid>
          <Grid class="h-54 py-2">
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
          </Grid>
        </Column>
      </PageCenterer>
    </div>
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

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
  onClose: () => void;
  hasMobileHeader: boolean;
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
        "fixed left-0 right-0 bottom-0 z-10 transition-[opacity,visibility] duration-100",

        // Always below the desktop nav. On mobile, below the mobile header if
        // present, otherwise at the top of the page.
        "desktop:top-12",
        props.hasMobileHeader ? "not-desktop:top-12" : "not-desktop:top-0",
        {
          "invisible": !props.open,
          "opacity-0": !props.open,
          "pointer-events-none": !props.open,
        },
      )}
    >
      <div
        class={clsx("relative z-1 transition-[translate] duration-100", {
          "-translate-y-4": !props.open,
        })}
      >
        <div class="absolute top-0 bottom-0 left-0 right-0 bg-bg-raised border-b border-soft-border opacity-95" />
        <PageCenterer class="relative z-1">
          <Column class="py-2 gap-2">
            <Grid class="relative">
              <Input
                value={query}
                onChange={setQuery}
                class="px-4 pl-11 h-8"
                placeholder={placeholder}
              />
              <MingcuteSearch2Line class="absolute left-4 top-[50%] translate-y-[-50%] pointer-events-none text-fg-weak text-lg" />
            </Grid>
            <Grid class="h-50">
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
      <div class="relative z-0 h-full" onClick={props.onClose} />
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

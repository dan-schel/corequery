import clsx from "clsx";
import { Column } from "@/web/components/core/Column";
import { usePageSearch } from "@/web/hooks/use-page-search";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { Button } from "@/web/components/button/Button";
import { Input } from "@/web/components/core/Input";
import { Grid } from "@/web/components/core/Grid";
import { MingcuteSearch2Line } from "@/web/components/icons/MingcuteSearch2Line";
import { PageCenterer } from "@/web/components/page/PageCenterer";
import { TextBlock } from "@/web/components/core/TextBlock";
import { useActivationDelay } from "@/web/hooks/use-activation-delay";
import { search } from "@/web/data/search";
import { useLocation } from "preact-iso";
import { itsOk } from "@dan-schel/js-utils";

type SearchDrawerProps = {
  class?: string;
  open: boolean;
  onClose: () => void;
};

export function SearchDrawer(props: SearchDrawerProps) {
  const [query, setQuery] = useState("");
  const { candidates, placeholder } = usePageSearch();
  const { route } = useLocation();

  const results = useMemo(
    () => search(query, candidates, { maxResults: 5 }),
    [query, candidates],
  );

  // Reset the query when the drawer closes.
  const drawerFullyClosed = useActivationDelay(!props.open, 300);
  useEffect(() => {
    if (drawerFullyClosed) {
      setQuery("");
    }
  }, [drawerFullyClosed]);

  // Focus the search input when the drawer opens.
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputReady = useActivationDelay(props.open, 100);
  useEffect(() => {
    if (searchInputReady) {
      inputRef.current?.focus();
    }
  }, [searchInputReady]);

  function handleSearchSubmit() {
    if (results.length > 0) {
      route(itsOk(results[0]).url);

      // We could end up "navigating" to the page we're already on, and in that
      // case this call is required to close the drawer.
      props.onClose();
    }
  }

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
      <div class="absolute top-0 bottom-0 left-0 right-0 bg-bg-raised border-b border-soft-border opacity-97" />
      <PageCenterer class="relative z-1">
        <Column>
          <Grid class="relative py-2 border-b border-b-soft-border not-desktop:bg-bg-navbar">
            <Input
              style="search"
              value={query}
              onChange={setQuery}
              class="px-4 pl-12 h-10 desktop:h-8 desktop:pl-11"
              placeholder={placeholder}
              inputRef={inputRef}
              onSubmit={handleSearchSubmit}
              search
            />
            <MingcuteSearch2Line class="absolute left-4 top-[50%] translate-y-[-50%] pointer-events-none text-fg-weak text-xl desktop:text-lg" />
          </Grid>
          <Column class="h-54 py-2">
            {results.length === 0 && (
              <Grid class="h-10 items-center">
                <TextBlock class="px-4" style="weak">
                  No results.
                </TextBlock>
              </Grid>
            )}
            {results.map((result, i) => (
              <Button
                key={i}
                text={result.name}
                href={result.url}
                icon={result.icon}
                theme="hover-square"
                layout="menu-item"
              />
            ))}
          </Column>
        </Column>
      </PageCenterer>
    </div>
  );
}

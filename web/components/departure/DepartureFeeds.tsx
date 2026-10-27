import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import type { DepartureFeedData } from "@/web/components/departure/types";
import { DepartureFeed } from "@/web/components/departure/DepartureFeed";

type DepartureFeedsProps = {
  class?: string;
  feeds: DepartureFeedData[];
};

export function DepartureFeeds(props: DepartureFeedsProps) {
  return (
    <Grid
      class={clsx(
        props.class,
        "desktop:grid-cols-[1fr_1fr] desktop:gap-6 desktop:px-4 desktop:py-8",
      )}
    >
      {props.feeds.map((feed, index) => (
        <DepartureFeed
          key={index}
          feed={feed}
          class="not-desktop:not-last:border-b not-desktop:not-last:border-soft-border"
        />
      ))}
    </Grid>
  );
}

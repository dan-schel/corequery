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

          // All feeds have a bottom border, but usually on mobile the page is
          // scrollable and the bottom of the last feed is flush against the
          // bottom of the page (well, the bottom nav). The bottom border still
          // needs to be there in case the screen is really tall, but otherwise
          // this 1px negative margin should hide it underneath the bottom nav
          // and prevent an ugly double thickness border.
          class="not-desktop:last:-mb-px"
        />
      ))}
    </Grid>
  );
}

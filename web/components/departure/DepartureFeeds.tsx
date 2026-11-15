import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import { DepartureFeed } from "@/web/components/departure/DepartureFeed";
import { useFodaSyncedQuery } from "@/web/hooks/api/use-foda-synced-query";
import { DEPARTURES_V0 } from "@/shared/apis";
import { useMemo } from "preact/hooks";
import { FrontendDeparture } from "@/web/data/frontend-departure";

type DepartureFeedsProps = {
  class?: string;
  instant: Temporal.Instant;
  feeds: {
    title: string;

    stopId: number;
    desiredCount: number;
    filterExpression: string;
  }[];
};

export function DepartureFeeds(props: DepartureFeedsProps) {
  // TODO: Discard data if feeds changes at all.
  const { data, loading, error } = useFodaSyncedQuery(DEPARTURES_V0, {
    instant: props.instant.toString(),
    direction: "forwards",
    feeds: props.feeds.map((x) => ({ ...x, skips: [] })),
  });

  const departureArrayMapping = useMemo(
    () =>
      props.feeds.map((x, i) => ({
        feed: x,
        departures: FrontendDeparture.wrapAll(data?.feeds[i]?.departures),
      })),
    [props.feeds, data],
  );

  return (
    <Grid
      class={clsx(
        props.class,
        "desktop:grid-cols-[1fr_1fr] desktop:gap-6 desktop:px-4 desktop:py-8",
      )}
    >
      {departureArrayMapping.map((x, i) => (
        <DepartureFeed
          key={i}
          feed={x.feed}
          departures={x.departures}
          loading={loading}
          hadError={error != null}

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

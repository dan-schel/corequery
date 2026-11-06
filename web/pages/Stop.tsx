import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useRoute } from "preact-iso";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { NotFoundPage } from "@/web/components/NotFoundPage";
import { useMemo, useState } from "preact/hooks";
import type { FodaStop } from "@/web/data/foundational-data/foda-stop-collection";
import { DEPARTURES_V0 } from "@/shared/apis";
import { LinesList } from "@/web/components/LinesList";
import { useCollapsingHeaders } from "@/web/components/page/header/use-collapsing-mobile-header";
import { DepartureFeeds } from "@/web/components/departure/DepartureFeeds";
import { DepartureControls } from "@/web/components/departure/DepartureControls";
import { useFodaSyncedQuery } from "@/web/hooks/api/use-foda-synced-query";
import type { DepartureFeedData } from "@/web/components/departure/types";

export default function Stop() {
  const {
    params: { id: stopUrlPath },
  } = useRoute();

  const { foda } = useFoundationalData();

  const stop = useMemo(
    () => foda.stops.getByUrlPath(stopUrlPath ?? ""),
    [foda.stops, stopUrlPath],
  );

  if (stop == null) {
    return <NotFoundPage afterConfirming="foundational-data-version" />;
  }

  return <StopPageContent key={stop.id} stop={stop} />;
}

type StopPageContentProps = {
  stop: FodaStop;
};

function StopPageContent(props: StopPageContentProps) {
  // TODO: useNow() - Also is the frontend supposed to be using Temporal? The
  // polyfill isn't currently installed for the frontend. If we're gonna use it
  // on the frontend, it'll need to be, since no versions of Safari support it
  // yet (as of November 2026).
  const [instant] = useState(() =>
    Temporal.Now.zonedDateTimeISO("UTC")
      .round({
        smallestUnit: "minute",
        roundingMode: "floor",
      })
      .toInstant(),
  );

  const { data, loading, error } = useFodaSyncedQuery(DEPARTURES_V0, {
    stopId: props.stop.id,
    instant: instant.toString(),
    direction: "forwards",
    feeds: [
      {
        desiredCount: 5,
        filterIds: [],
        skips: [],
      },
      {
        desiredCount: 5,
        filterIds: [],
        skips: [],
      },
    ],
  });

  const feeds = useMemo<DepartureFeedData[]>(
    () => [
      {
        query: {
          title: "Citybound trains",
          desiredCount: 5,
        },
        departures: data?.feeds[0]?.departures ?? [],
        loading,
        hadError: error != null,
      },
      {
        query: {
          title: "Outbound trains",
          desiredCount: 5,
        },
        departures: data?.feeds[1]?.departures ?? [],
        loading,
        hadError: error != null,
      },
    ],
    [data, loading, error],
  );

  return (
    <Page
      {...useCollapsingHeaders({
        title: props.stop.name,
        back: {
          href: "/",
          text: "Home",
        },
        additionalContent: (
          <LinesList lineIds={props.stop.canonicalLinesServingStop} withLinks />
        ),
      })}
    >
      <Column>
        <DepartureControls />
        <DepartureFeeds feeds={feeds} />
      </Column>
    </Page>
  );
}

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
  // TODO: Use useNow().
  const [instant] = useState(() =>
    Temporal.Now.zonedDateTimeISO("UTC")
      .round({
        smallestUnit: "minute",
        roundingMode: "floor",
      })
      .toInstant(),
  );

  const { data, loading, error } = useFodaSyncedQuery(DEPARTURES_V0, {
    instant: instant.toString(),
    direction: "forwards",
    feeds: props.stop.defaultDepartureFeeds.map((x) => ({
      stopId: props.stop.id,
      desiredCount: x.desiredCount,
      filterExpression: `${x.filterExpression} !arr !sdo`.trim(),
      skips: [],
    })),
  });

  const feeds = useMemo<DepartureFeedData[]>(
    () =>
      props.stop.defaultDepartureFeeds.map((x, i) => ({
        query: {
          title: x.name,
          desiredCount: x.desiredCount,
        },
        departures: data?.feeds[i]?.departures ?? [],
        loading,
        hadError: error != null,
      })),
    [props.stop.defaultDepartureFeeds, data, loading, error],
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

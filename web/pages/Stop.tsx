import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useRoute } from "preact-iso";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { NotFoundPage } from "@/web/components/NotFoundPage";
import { useMemo } from "preact/hooks";
import type { FodaStop } from "@/web/data/foundational-data/foda-stop-collection";
import { DEPARTURES_V0 } from "@/shared/apis";
import { LinesList } from "@/web/components/LinesList";
import { useCollapsingHeaders } from "@/web/components/page/header/use-collapsing-mobile-header";
import { DepartureFeeds } from "@/web/components/departure/DepartureFeeds";
import { DepartureControls } from "@/web/components/departure/DepartureControls";
import { useFodaSyncedQuery } from "@/web/hooks/api/use-foda-synced-query";

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
  const { data, loading, error } = useFodaSyncedQuery(DEPARTURES_V0, {
    stopId: props.stop.id,
    count: 5,
  });

  const feeds = useMemo(
    () => [
      {
        query: {
          title: "Citybound trains",
          count: 5,
        },
        departures: data?.departures ?? [],
        loading,
        isError: error != null,
      },
      {
        query: {
          title: "Outbound trains",
          count: 5,
        },
        departures: data?.departures ?? [],
        loading,
        isError: error != null,
      },
    ],
    [data?.departures, loading, error],
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

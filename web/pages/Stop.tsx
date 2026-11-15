import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useRoute } from "preact-iso";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { NotFoundPage } from "@/web/components/NotFoundPage";
import { useMemo } from "preact/hooks";
import type { FodaStop } from "@/web/data/foundational-data/foda-stop-collection";
import { LinesList } from "@/web/components/LinesList";
import { useCollapsingHeaders } from "@/web/components/page/header/use-collapsing-mobile-header";
import { DepartureFeeds } from "@/web/components/departure/DepartureFeeds";
import { DepartureControls } from "@/web/components/departure/DepartureControls";
import { useNow } from "@/web/hooks/use-now";

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
  const { currentMinute } = useNow();

  const feeds = props.stop.defaultDepartureFeeds.map((x) => ({
    title: x.name,
    stopId: props.stop.id,
    desiredCount: x.desiredCount,
    filterExpression: `${x.filterExpression} !arr !sdo`.trim(),
  }));

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
        <DepartureFeeds feeds={feeds} instant={currentMinute} />
      </Column>
    </Page>
  );
}

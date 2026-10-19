import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useRoute } from "preact-iso";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { NotFoundPage } from "@/web/components/NotFoundPage";
import { useMemo } from "preact/hooks";
import type { FodaStop } from "@/web/data/foundational-data/foda-stop-collection";
import { useQuery } from "@/web/hooks/use-query";
import { DEPARTURES_V0 } from "@/shared/apis";
import { LoadingSpinner } from "@/web/components/LoadingSpinner";
import { Strong } from "@/web/components/core/Strong";
import type { ResultOf } from "@/shared/apis/types";
import { OutlinedButtonHousing } from "@/web/components/button/housings/OutlinedButtonHousing";
import { LinesList } from "@/web/components/LinesList";
import { useCollapsingHeaders } from "@/web/components/page/use-collapsing-mobile-header";
import { Button } from "@/web/components/button/Button";
import { MingcuteLeftLine } from "@/web/components/icons/MingcuteLeftLine";

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
  const { data, loading, error } = useQuery(DEPARTURES_V0, {
    stopId: props.stop.id,
    count: 10,
  });

  return (
    <Page
      {...useCollapsingHeaders({
        title: props.stop.name,
        content: <Header stop={props.stop} />,
      })}
    >
      <Column class="px-4 py-8 gap-8">
        {loading && <LoadingSpinner />}
        {!loading && (error != null || data == null) && (
          <TextBlock>Error loading departures.</TextBlock>
        )}
        {!loading && data != null && data.departures.length === 0 && (
          <TextBlock>No departures found.</TextBlock>
        )}
        {!loading && data != null && data.departures.length > 0 && (
          <Column class="gap-4">
            {data.departures.map((d) => (
              <Departure
                key={`${d.sourceId}/${d.intrasourceId}`}
                departure={d}
              />
            ))}
          </Column>
        )}
      </Column>
    </Page>
  );
}

type ApiDeparture = ResultOf<typeof DEPARTURES_V0>["departures"][number];

function Departure({ departure }: { departure: ApiDeparture }) {
  const destinationSuffix =
    departure.secondaryDestinationText != null
      ? ` ${departure.secondaryDestinationText}`
      : "";

  const statusSuffix = departure.isCancelled ? " (Cancelled)" : "";

  const urlSourceId = encodeURIComponent(departure.sourceId);
  const urlIntrasourceId = encodeURIComponent(departure.intrasourceId);
  const urlFrom = encodeURIComponent(departure.movement.index.toString());
  const url = `/service/${urlSourceId}/${urlIntrasourceId}?from=${urlFrom}`;

  return (
    <OutlinedButtonHousing href={url} class="p-4">
      <Column class="gap-4">
        <Column class="gap-3">
          <TextBlock>
            <Strong>{departure.primaryDestinationText}</Strong>
            {destinationSuffix}
            {statusSuffix}
          </TextBlock>
          <TextBlock>
            {new Date(Date.parse(departure.movement.time)).toLocaleString()}
          </TextBlock>
          {departure.movement.formerTime != null && (
            <TextBlock style="weak-struckout">
              {new Date(
                Date.parse(departure.movement.formerTime),
              ).toLocaleString()}
            </TextBlock>
          )}
        </Column>
        <TextBlock style="small-weak">
          Source: {departure.sourceId}&ensp;&bull;&ensp;ID:{" "}
          {departure.intrasourceId}
        </TextBlock>
      </Column>
    </OutlinedButtonHousing>
  );
}

function Header({ stop }: { stop: FodaStop }) {
  return (
    <Column class="pt-4 gap-8 pb-6">
      <Button
        text="Back"
        icon={MingcuteLeftLine}
        class="self-start"
        layout="narrow-icon"
      />
      <Column class="gap-4">
        <TextBlock style="megatitle">{stop.name}</TextBlock>
        <LinesList lineIds={stop.canonicalLinesServingStop} withLinks />
      </Column>
    </Column>
  );
}

import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/use-simple-headers";
import { useRoute } from "preact-iso";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { NotFoundPage } from "@/web/components/NotFoundPage";
import { listifyAnd } from "@dan-schel/js-utils";
import { useMemo } from "preact/hooks";
import type { FodaStop } from "@/web/data/foundational-data/foda-stop-collection";
import { useQuery } from "@/web/hooks/use-query";
import { DEPARTURES_V0 } from "@/shared/apis";
import { LoadingSpinner } from "@/web/components/LoadingSpinner";
import { Strong } from "@/web/components/core/Strong";
import { HoverButtonHousing } from "@/web/components/button/housings/HoverButtonHousing";
import type { ResultOf } from "@/shared/apis/types";
import { OutlinedButtonHousing } from "../components/button/housings/OutlinedButtonHousing";

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
  const { foda } = useFoundationalData();

  const { data, loading, error } = useQuery(DEPARTURES_V0, {
    stopId: props.stop.id,
    count: 10,
  });

  return (
    <Page {...useSimpleHeaders({ title: props.stop.name })}>
      <Column class="px-4 py-8 gap-8">
        <TextBlock>
          {
            // TODO: This is obviously horrible and temporary! The formatting
            // needs to respect the terminology.
            listifyAnd(
              props.stop.canonicalLinesServingStop
                .map((x) => foda.lines.require(x).name)
                .sort((a, b) => a.localeCompare(b)),
            )
          }{" "}
          {props.stop.canonicalLinesServingStop.length === 1 ? "Line" : "lines"}
        </TextBlock>

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

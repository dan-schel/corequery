import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/use-simple-headers";
import { useRoute } from "preact-iso";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { parseIntNull } from "@dan-schel/js-utils";
import { useQuery } from "@/web/hooks/use-query";
import { SERVICE_V0 } from "@/shared/apis";
import { LoadingSpinner } from "@/web/components/LoadingSpinner";
import { Button } from "@/web/components/button/Button";
import { MingcuteHome4Line } from "@/web/components/icons/MingcuteHome4Line";
import type { ResultOf } from "@/shared/apis/types";
import { Strong } from "@/web/components/core/Strong";

export default function Service() {
  const {
    params: { sourceId, intrasourceId },
    query: { from },
  } = useRoute();

  // TODO: Should I use zod to parse URL/query params?
  const { data, loading, error } = useQuery(SERVICE_V0, {
    sourceId: sourceId ?? "",
    intrasourceId: intrasourceId ?? "",
  });

  const movementIndex = parseIntNull(from ?? "");

  if (loading) {
    return <LoadingSpinner />;
  } else if (
    error != null ||
    data == null ||
    movementIndex == null ||
    movementIndex < 0 ||
    (data.service != null && movementIndex > data.service.movements.length - 1)
  ) {
    // TODO: Use something prettier!
    return <TextBlock>Failed to load service.</TextBlock>;
  } else if (data.service == null) {
    return <ServiceNotFoundPage />;
  } else {
    return (
      <ServicePageContent
        key={`${sourceId}/${intrasourceId}`}
        service={data.service}
        movementIndex={movementIndex}
      />
    );
  }
}

type ServicePageContentProps = {
  service: NonNullable<ResultOf<typeof SERVICE_V0>["service"]>;
  movementIndex: number;
};

function ServicePageContent(props: ServicePageContentProps) {
  const { foda } = useFoundationalData();

  return (
    <Page
      {...useSimpleHeaders({
        // TODO: Replace "service" with whatever the terminology is in the FODA
        // (will be "train" for trainquery-melbourne).
        title: `${props.service.primaryDestinationText} service`,
      })}
    >
      <Column class="px-4 py-8 gap-8">
        <Column class="gap-6">
          {props.service.movements.map((m, i) => {
            const arrivalTime =
              m.arrivalTime != null
                ? new Date(Date.parse(m.arrivalTime)).toLocaleString()
                : null;

            const departureTime =
              m.departureTime != null
                ? new Date(Date.parse(m.departureTime)).toLocaleString()
                : null;

            if (arrivalTime == null && departureTime == null) {
              return (
                <TextBlock key={i} style="small">
                  Skips {foda.stops.require(m.stopId).name}
                </TextBlock>
              );
            }

            const time = departureTime ?? arrivalTime;

            const formerArrivalTime =
              m.formerArrivalTime != null
                ? new Date(Date.parse(m.formerArrivalTime)).toLocaleString()
                : null;

            const formerDepartureTime =
              m.formerDepartureTime != null
                ? new Date(Date.parse(m.formerDepartureTime)).toLocaleString()
                : null;

            const formerTime =
              departureTime != null
                ? formerDepartureTime
                : arrivalTime != null
                  ? formerArrivalTime
                  : null;

            const formerTimePrefix =
              formerTime != null ? (
                <>
                  <span class="line-through text-fg-weak">
                    {formerTime}
                  </span>{" "}
                </>
              ) : (
                ""
              );

            return (
              <TextBlock key={i}>
                <Strong>{foda.stops.require(m.stopId).name}</Strong>
                &ensp;&bull;&ensp;{formerTimePrefix}
                {time}
              </TextBlock>
            );
          })}
        </Column>
      </Column>
    </Page>
  );
}

function ServiceNotFoundPage() {
  // TODO: We could attempt to auto-repair service page links, if we always make
  // sure to include the from stop ID, time of departure, line ID, and something
  // to indicate direction in the service page URL. We'd only access these
  // values if the source ID and intrasource ID didn't resolve to a service, and
  // we'd use them to look-up nearby departures and suggest them here. If we
  // were confident enough in one of the results, we could even redirect to it.

  // TODO: Use terminology for "service" and "stop" from FODA.
  return (
    <Page mobileHeader={null} desktopHeader={null}>
      <Column class="px-4 py-8 gap-8" xAlign="center" yAlign="center">
        <TextBlock style="title" align="center">
          Service not found
        </TextBlock>
        <TextBlock align="center">
          This can happen if the service was cancelled, or the timetable changed
          since this link was generated. You might be able to find it again by
          searching for one of the stops it departed from.
        </TextBlock>
        <Button href="/" text="Go home" icon={MingcuteHome4Line} />
      </Column>
    </Page>
  );
}

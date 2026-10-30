import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/header/use-simple-headers";
import { useRoute } from "preact-iso";
import { parseIntNull } from "@dan-schel/js-utils";
import { useQuery } from "@/web/hooks/api/use-query";
import { SERVICE_V0 } from "@/shared/apis";
import { LoadingSpinner } from "@/web/components/LoadingSpinner";
import { Button } from "@/web/components/button/Button";
import { MingcuteHome4Line } from "@/web/components/icons/MingcuteHome4Line";
import type { ClientResultOf } from "@/web/hooks/api/types";
import { ServiceDiagram } from "@/web/components/pages/service/ServiceDiagram";

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
    return <ServiceLoadingPage />;
  } else if (
    error != null ||
    data == null ||
    movementIndex == null ||
    movementIndex < 0 ||
    (data.service != null && movementIndex > data.service.movements.length - 1)
  ) {
    return <ServiceErrorPage />;
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
  service: NonNullable<ClientResultOf<typeof SERVICE_V0>["service"]>;
  movementIndex: number;
};

function ServicePageContent(props: ServicePageContentProps) {
  return (
    <Page
      {...useSimpleHeaders({
        // TODO: Replace "service" with whatever the terminology is in the FODA
        // (will be "train" for trainquery-melbourne).
        title: `${props.service.primaryDestinationText} service`,
        back: {
          href: "/",
          text: "Home",
        },
      })}
    >
      <Column class="px-4 py-8 gap-8">
        {/* TODO: Collapse (and show faded ) */}
        <ServiceDiagram service={props.service} />

        {/* TODO: Only show if applicable. */}
        <TextBlock style="small-narrow">
          (Real-time data has not been provided for all stops. Times marked with
          * are estimates, extrapolated from the available data.)
        </TextBlock>
      </Column>
    </Page>
  );
}

function ServiceLoadingPage() {
  return (
    <Page
      {...useSimpleHeaders({
        title: `Loading...`,
        back: {
          href: "/",
          text: "Home",
        },
      })}
    >
      <LoadingSpinner />
    </Page>
  );
}

function ServiceErrorPage() {
  // TODO: Use something prettier!
  return (
    <Page
      {...useSimpleHeaders({
        title: `Error`,
        back: {
          href: "/",
          text: "Home",
        },
      })}
    >
      <TextBlock>Failed to load service.</TextBlock>
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

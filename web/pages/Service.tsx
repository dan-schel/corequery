import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/header/use-simple-headers";
import { useRoute } from "preact-iso";
import { parseIntNull } from "@dan-schel/js-utils";
import { useFodaSyncedQuery } from "@/web/hooks/api/use-foda-synced-query";
import { SERVICE_V0 } from "@/shared/apis";
import { LoadingSpinner } from "@/web/components/LoadingSpinner";
import { Button } from "@/web/components/button/Button";
import { MingcuteHome4Line } from "@/web/components/icons/MingcuteHome4Line";
import { ServiceDiagram } from "@/web/components/pages/service/ServiceDiagram";
import { useTerminology } from "@/web/hooks/use-terminology";
import { CorequeryUrls } from "@/web/pages/corequery-urls";
import { FrontendService } from "@/web/data/service/frontend-service";
import { useMemo } from "preact/hooks";

export default function Service() {
  const {
    params: { sourceId, intrasourceId },
    query: { from },
  } = useRoute();

  // TODO: Should I use zod to parse URL/query params?
  const { data, loading, error } = useFodaSyncedQuery(SERVICE_V0, {
    sourceId: sourceId ?? "",
    intrasourceId: intrasourceId ?? "",
  });

  const service = useMemo(() => {
    if (data?.service == null) return null;
    return FrontendService.wrap(data.service);
  }, [data]);

  const movementIndex = parseIntNull(from ?? "");

  if (loading) {
    return <ServiceLoadingPage />;
  } else if (
    error != null ||
    data == null ||
    movementIndex == null ||
    movementIndex < 0 ||
    (service != null && movementIndex > service.movements.length - 1)
  ) {
    return <ServiceErrorPage />;
  } else if (service == null) {
    return <ServiceNotFoundPage />;
  } else {
    return (
      <ServicePageContent
        key={`${sourceId}/${intrasourceId}`}
        service={service}
        movementIndex={movementIndex}
      />
    );
  }
}

type ServicePageContentProps = {
  service: FrontendService;
  movementIndex: number;
};

function ServicePageContent(props: ServicePageContentProps) {
  const { singularServiceTerm } = useTerminology();

  return (
    <Page
      {...useSimpleHeaders({
        title: `${props.service.primaryDestinationText} ${singularServiceTerm}`,
        back: {
          href: CorequeryUrls.home,
          text: "Home",
        },
      })}
    >
      <Column class="px-4 py-8 gap-8">
        {/* TODO: Collapse (and show faded ) */}
        <ServiceDiagram service={props.service} />

        {/* TODO: Only show if applicable. */}
        <TextBlock style="disclaimer">
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
          href: CorequeryUrls.home,
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
          href: CorequeryUrls.home,
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
        <Button
          href={CorequeryUrls.home}
          text="Go home"
          icon={MingcuteHome4Line}
        />
      </Column>
    </Page>
  );
}

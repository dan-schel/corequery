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
import { useCollapsingHeaders } from "@/web/components/page/header/use-collapsing-mobile-header";
import { LinesList } from "@/web/components/LinesList";
import { Row } from "@/web/components/core/Row";
import { formatTime } from "@/web/data/time-formatting";
import type { FrontendServiceMovement } from "@/web/data/service/frontend-service-movement";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";

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

  const movement = useMemo(() => {
    if (service == null || movementIndex == null) return null;
    const movement = service.movements[movementIndex];

    if (movement == null || movement.isPassing) return null;
    return movement;
  }, [service, movementIndex]);

  if (loading) {
    return <ServiceLoadingPage />;
  } else if (error != null || data == null) {
    return <ServiceErrorPage />;
  } else if (service == null) {
    return <ServiceNotFoundPage />;
  } else if (movement == null || movementIndex == null) {
    return <ServiceErrorPage />;
  } else {
    return (
      <ServicePageContent
        key={`${sourceId}/${intrasourceId}`}
        service={service}
        movementIndex={movementIndex}
        movement={movement}
      />
    );
  }
}

type ServicePageContentProps = {
  service: FrontendService;
  movementIndex: number;
  movement: FrontendServiceMovement;
};

function ServicePageContent(props: ServicePageContentProps) {
  const { foda } = useFoundationalData();
  const { singularServiceTerm } = useTerminology();

  const scheduledTime = useMemo(() => {
    const times = props.movement.servicePageTime;
    const scheduledTime = times.formerTime ?? times.time;

    const plainTime = scheduledTime
      .toZonedDateTimeISO(foda.formatTimezone)
      .toPlainTime();

    return formatTime(plainTime);
  }, [foda.formatTimezone, props.movement]);

  return (
    <Page
      {...useCollapsingHeaders({
        title: `${scheduledTime} ${props.service.primaryDestinationText} ${singularServiceTerm}`,
        back: {
          href: CorequeryUrls.home,
          text: "Home",
        },
        overriddenContent: (
          <Column class="gap-6">
            <Column class="gap-4">
              <TextBlock>
                {scheduledTime} {singularServiceTerm} to
              </TextBlock>
              <TextBlock style="megatitle">
                {props.service.primaryDestinationText}
              </TextBlock>
            </Column>
            <LinesList lineIds={props.service.lineIds} withLinks />
          </Column>
        ),
      })}
    >
      <Column class="gap-8 desktop:py-6 pb-8">
        <Column class="desktop:gap-2 desktop:mx-4">
          <Row class="bg-bg-raised p-4 border-soft-border desktop:border not-desktop:border-b desktop:rounded-lg">
            <TextBlock style="departure-info">
              Whether the train is running on time, delayed, cancelled, etc.
            </TextBlock>
          </Row>
          <Row class="bg-bg-raised p-4 border-soft-border desktop:border not-desktop:border-b desktop:rounded-lg">
            <TextBlock style="departure-info">
              A disruption message or something.
            </TextBlock>
          </Row>
        </Column>
        <Column class="px-4 gap-8">
          {/* TODO: Collapse (and show faded ) */}
          <ServiceDiagram service={props.service} />

          {/* TODO: Only show if applicable. */}
          <TextBlock style="disclaimer">
            (Real-time data has not been provided for all stops. Times marked
            with * are estimates, extrapolated from the available data.)
          </TextBlock>
        </Column>
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

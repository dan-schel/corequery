import type { DEPARTURES_V0 } from "@/shared/apis";
import type { TextColor } from "@/web/components/core/ColoredText";
import { FrontendDepartureTimeStrings } from "@/web/data/departure/frontend-departure-time-strings";
import type { FrontendServiceTimeType } from "@/web/data/service/frontend-service-movement";
import type { ClientFodaSyncedResultOf } from "@/web/hooks/api/types";
import { CorequeryUrls } from "@/web/pages/corequery-urls";

type DepartureFromApi = ClientFodaSyncedResultOf<
  typeof DEPARTURES_V0
>["feeds"][number]["departures"][number];

type FrontendDepartureFields = {
  readonly sourceId: string;
  readonly intrasourceId: string;

  readonly lineIds: readonly number[];
  readonly primaryDestinationText: string;
  readonly secondaryDestinationText: string | null;
  readonly color: TextColor | null;

  readonly isCancelled: boolean;

  readonly stopId: number;
  readonly positionId: number | null;
  readonly timeType: FrontendServiceTimeType;
  readonly time: Temporal.Instant;
  readonly formerTime: Temporal.Instant | null;
  readonly movementIndex: number;
};

export class FrontendDeparture {
  readonly sourceId: string;
  readonly intrasourceId: string;

  readonly lineIds: readonly number[];
  readonly primaryDestinationText: string;
  readonly secondaryDestinationText: string | null;
  readonly color: TextColor | null;

  readonly isCancelled: boolean;

  readonly stopId: number;
  readonly positionId: number | null;
  readonly timeType: FrontendServiceTimeType;
  readonly time: Temporal.Instant;
  readonly formerTime: Temporal.Instant | null;
  readonly movementIndex: number;

  constructor(fields: FrontendDepartureFields) {
    this.sourceId = fields.sourceId;
    this.intrasourceId = fields.intrasourceId;

    this.lineIds = fields.lineIds;
    this.primaryDestinationText = fields.primaryDestinationText;
    this.secondaryDestinationText = fields.secondaryDestinationText;
    this.color = fields.color;

    this.isCancelled = fields.isCancelled;

    this.stopId = fields.stopId;
    this.positionId = fields.positionId;
    this.timeType = fields.timeType;
    this.time = fields.time;
    this.formerTime = fields.formerTime;
    this.movementIndex = fields.movementIndex;
  }

  get servicePageUrl() {
    return CorequeryUrls.service(
      this.sourceId,
      this.intrasourceId,
      this.movementIndex,
    );
  }

  getTimeStrings(now: Temporal.Instant, formatTimezone: string) {
    return FrontendDepartureTimeStrings.build(this, now, formatTimezone);
  }

  static wrap(stopId: number, departure: DepartureFromApi) {
    return new FrontendDeparture({
      sourceId: departure.sourceId,
      intrasourceId: departure.intrasourceId,

      lineIds: departure.lineIds,
      primaryDestinationText: departure.primaryDestinationText,
      secondaryDestinationText: departure.secondaryDestinationText,
      color: departure.color,

      isCancelled: departure.isCancelled,

      stopId,
      positionId: departure.movement.positionId ?? null,
      timeType: departure.movement.timeType,
      time: Temporal.Instant.from(departure.movement.time),
      formerTime:
        departure.movement.formerTime != null
          ? Temporal.Instant.from(departure.movement.formerTime)
          : null,
      movementIndex: departure.movement.index,
    });
  }

  static wrapAll(
    stopId: number,
    departures: DepartureFromApi[] | null | undefined,
  ) {
    return departures?.map((x) => FrontendDeparture.wrap(stopId, x)) ?? [];
  }
}

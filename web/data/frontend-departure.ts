import type { DEPARTURES_V0 } from "@/shared/apis";
import type { TextColor } from "@/web/components/core/ColoredText";
import { FrontendDepartureTimeStrings } from "@/web/data/frontend-departure-time-strings";
import type { ClientFodaSyncedResultOf } from "@/web/hooks/api/types";

type DepartureFromApi = ClientFodaSyncedResultOf<
  typeof DEPARTURES_V0
>["feeds"][number]["departures"][number];

export type FrontendServiceTypeTime =
  "scheduled-time" | "provided-live-time" | "interpolated-live-time";

type FrontendDepartureFields = {
  readonly sourceId: string;
  readonly intrasourceId: string;

  readonly lineIds: readonly number[];
  readonly primaryDestinationText: string;
  readonly secondaryDestinationText: string | null;
  readonly color: TextColor | null;

  readonly timeType: FrontendServiceTypeTime;
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

  readonly timeType: FrontendServiceTypeTime;
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

    this.timeType = fields.timeType;
    this.time = fields.time;
    this.formerTime = fields.formerTime;
    this.movementIndex = fields.movementIndex;
  }

  get servicePageUrl() {
    const sourceId = encodeURIComponent(this.sourceId);
    const intrasourceId = encodeURIComponent(this.intrasourceId);
    const movementIndex = encodeURIComponent(this.movementIndex.toString());
    return `/service/${sourceId}/${intrasourceId}?from=${movementIndex}`;
  }

  getTimeStrings(now: Temporal.Instant, formatTimezone: string) {
    return FrontendDepartureTimeStrings.build(this, now, formatTimezone);
  }

  static wrap(departure: DepartureFromApi) {
    return new FrontendDeparture({
      sourceId: departure.sourceId,
      intrasourceId: departure.intrasourceId,

      lineIds: departure.lineIds,
      primaryDestinationText: departure.primaryDestinationText,
      secondaryDestinationText: departure.secondaryDestinationText,
      color: departure.color,

      timeType: departure.movement.timeType,
      time: Temporal.Instant.from(departure.movement.time),
      formerTime:
        departure.movement.formerTime != null
          ? Temporal.Instant.from(departure.movement.formerTime)
          : null,

      movementIndex: departure.movement.index,
    });
  }

  static wrapAll(departures: DepartureFromApi[] | null | undefined) {
    return departures?.map((x) => FrontendDeparture.wrap(x)) ?? [];
  }
}

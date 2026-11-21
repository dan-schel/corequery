import type { SERVICE_V0 } from "@/shared/apis";
import type { TextColor } from "@/web/components/core/ColoredText";
import { FrontendServiceMovement } from "@/web/data/service/frontend-service-movement";
import type { ClientFodaSyncedResultOf } from "@/web/hooks/api/types";

export type ServiceFromApi = NonNullable<
  ClientFodaSyncedResultOf<typeof SERVICE_V0>["service"]
>;

type FrontendServiceFields = {
  readonly sourceId: string;
  readonly intrasourceId: string;

  readonly primaryDestinationText: string;

  readonly lineIds: readonly number[];
  readonly color: TextColor | null;

  readonly isCancelled: boolean;

  readonly movements: readonly FrontendServiceMovement[];
};

export class FrontendService {
  readonly sourceId: string;
  readonly intrasourceId: string;

  readonly primaryDestinationText: string;

  readonly lineIds: readonly number[];
  readonly color: TextColor | null;

  readonly isCancelled: boolean;

  readonly movements: readonly FrontendServiceMovement[];

  constructor(fields: FrontendServiceFields) {
    this.sourceId = fields.sourceId;
    this.intrasourceId = fields.intrasourceId;

    this.primaryDestinationText = fields.primaryDestinationText;

    this.lineIds = fields.lineIds;
    this.color = fields.color;

    this.isCancelled = fields.isCancelled;

    this.movements = fields.movements;
  }

  static wrap(service: ServiceFromApi) {
    return new FrontendService({
      sourceId: service.sourceId,
      intrasourceId: service.intrasourceId,

      primaryDestinationText: service.primaryDestinationText,

      lineIds: service.lineIds,
      color: service.color,

      isCancelled: service.isCancelled,

      movements: FrontendServiceMovement.wrapAll(service.movements),
    });
  }
}

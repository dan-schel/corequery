import type { Tags } from "@/server/data/tags.js";
import type { ServiceMovement } from "@/server/data/service/service-movement.js";
import type { ServiceConnection } from "@/server/data/service/service-connection.js";
import { itsOk } from "@dan-schel/js-utils";
import type { ServiceOriginatingMovement } from "@/server/data/service/service-originating-movement.js";
import type { ServiceTerminatingMovement } from "@/server/data/service/service-terminating-movement.js";
import { getHexCodesForColor, type Color } from "@/server/data/color.js";

type ServiceLiveDataType = "scheduled" | "updated" | "added";

type ServiceFields = {
  readonly sourceId: string;
  readonly intrasourceId: string;

  readonly lineIds: readonly number[];
  readonly tags: Tags;
  readonly color: Color | null;

  readonly liveDataType: ServiceLiveDataType;
  readonly movements: readonly ServiceMovement[];
  readonly isCancelled: boolean;

  readonly connections: readonly ServiceConnection[];
};

export class Service {
  readonly sourceId: string;
  readonly intrasourceId: string;

  readonly lineIds: readonly number[];
  readonly tags: Tags;
  readonly color: Color | null;

  readonly liveDataType: ServiceLiveDataType;
  readonly movements: readonly ServiceMovement[];
  readonly origination: ServiceOriginatingMovement;
  readonly termination: ServiceTerminatingMovement;
  readonly isCancelled: boolean;

  readonly connections: readonly ServiceConnection[];
  readonly previousServiceOfEntireVehicle: ServiceConnection | null;
  readonly nextServiceOfEntireVehicle: ServiceConnection | null;

  constructor(fields: ServiceFields) {
    this.sourceId = fields.sourceId;
    this.intrasourceId = fields.intrasourceId;

    this.lineIds = fields.lineIds;
    this.tags = fields.tags;
    this.color = fields.color;

    this.liveDataType = fields.liveDataType;
    this.movements = fields.movements;
    this.isCancelled = fields.isCancelled;

    this.connections = fields.connections;

    if (this.movements.length < 2) throw new Error("Must have 2+ movements.");

    const origination = itsOk(this.movements[0]);
    const originOk = origination.type === "originating";
    if (!originOk) throw new Error("First movement of wrong type.");
    this.origination = origination;

    const termination = itsOk(this.movements.at(-1));
    const terminusOk = termination.type === "terminating";
    if (!terminusOk) throw new Error("Last movement of wrong type");
    this.termination = termination;

    const othersOk = this.movements.slice(1, -1).every((m) => m.isNonTerminal);
    if (!othersOk) throw new Error("Some terminal movements in wrong places.");

    this.previousServiceOfEntireVehicle =
      this.connections.find(
        (c) =>
          c.type === "entire-vehicle-forms-service" &&
          c.direction === "from-other" &&
          c.movementIndex === 0,
      ) ?? null;

    this.nextServiceOfEntireVehicle =
      this.connections.find(
        (c) =>
          c.type === "entire-vehicle-forms-service" &&
          c.direction === "to-other" &&
          c.movementIndex === this.movements.length - 1,
      ) ?? null;
  }

  with(fields: Partial<ServiceFields>): Service {
    return new Service({ ...this, ...fields });
  }

  getColorHexCodes() {
    return this.color != null ? getHexCodesForColor(this.color) : null;
  }
}

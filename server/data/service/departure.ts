import type { Service } from "@/server/data/service/service.js";
import type { ServiceServicingMovement } from "@/server/data/service/service-movement.js";

type DepartureFields = {
  readonly service: Service;
  readonly movementIndex: number;
};

export class Departure {
  readonly service: Service;
  readonly movementIndex: number;

  readonly movement: ServiceServicingMovement;

  constructor(fields: DepartureFields) {
    this.service = fields.service;
    this.movementIndex = fields.movementIndex;

    const movement = this.service.movements[this.movementIndex];
    if (movement == null) throw new Error("Invalid movement index.");
    if (!movement.isServicing) throw new Error("Non servicing movement.");
    this.movement = movement;
  }

  with(fields: Partial<DepartureFields>): Departure {
    return new Departure({ ...this, ...fields });
  }
}

type ServicePassingMovementFields = {
  readonly stopId: number;
};

export class ServicePassingMovement {
  readonly stopId: number;

  constructor(fields: ServicePassingMovementFields) {
    this.stopId = fields.stopId;
  }

  with(fields: Partial<ServicePassingMovementFields>): ServicePassingMovement {
    return new ServicePassingMovement({ ...this, ...fields });
  }

  get type() {
    return "passing" as const;
  }

  get isServicing() {
    return false as const;
  }

  get isNonTerminal() {
    return true as const;
  }
}

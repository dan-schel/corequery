// If "entire-vehicle-forms-service", then corequery knows it should lookup the
// next/prev service repeatedly until it finds a serviced stop in common, so
// that it can show the full (useful) journey that the vehicle takes/took.
type ServiceConnectionType = "entire-vehicle-forms-service" | "other";

type ServiceConnectionDirection = "from-other" | "to-other" | "bidirectional";

type ServiceConnectionFields = {
  readonly type: ServiceConnectionType;
  readonly direction: ServiceConnectionDirection;
  readonly otherServiceSourceId: string;
  readonly otherServiceIntrasourceId: string;

  readonly movementIndex: number;
  readonly otherServiceMovementIndex: number;
};

export class ServiceConnection {
  readonly type: ServiceConnectionType;
  readonly direction: ServiceConnectionDirection;

  // Other service only given as foreign key, because it could theoretically be
  // quite a long/infinite chain, e.g. for City Circle trains that just go round
  // and round, and CoreQuery should be able to fetch as many/as few as it needs
  // to be "useful".
  readonly otherServiceSourceId: string;
  readonly otherServiceIntrasourceId: string;

  readonly movementIndex: number;
  readonly otherServiceMovementIndex: number;

  constructor(fields: ServiceConnectionFields) {
    this.type = fields.type;
    this.direction = fields.direction;
    this.otherServiceSourceId = fields.otherServiceSourceId;
    this.otherServiceIntrasourceId = fields.otherServiceIntrasourceId;

    this.movementIndex = fields.movementIndex;
    this.otherServiceMovementIndex = fields.otherServiceMovementIndex;
  }

  with(fields: Partial<ServiceConnectionFields>): ServiceConnection {
    return new ServiceConnection({ ...this, ...fields });
  }
}

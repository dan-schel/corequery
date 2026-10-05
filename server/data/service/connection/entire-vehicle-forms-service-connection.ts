type EntireVehicleFormsServiceConnectionFields = {
  readonly direction: "from-other" | "to-other";
  readonly otherServiceSourceId: string;
  readonly otherServiceIntrasourceId: string;
};

// The connection type which indicates that CoreQuery should lookup the
// next/previous service repeatedly until it finds a serviced stop in common, so
// that it can show the full (useful) journey that the vehicle takes/took.
export class EntireVehicleFormsServiceConnection {
  readonly direction: "from-other" | "to-other";

  // Other service only given as foreign key, because it could theoretically be
  // quite a long/infinite chain, e.g. for City Circle trains that just go round
  // and round, and CoreQuery should be able to fetch as many/as few as it needs
  // to be "useful".
  readonly otherServiceSourceId: string;
  readonly otherServiceIntrasourceId: string;

  constructor(fields: EntireVehicleFormsServiceConnectionFields) {
    this.direction = fields.direction;
    this.otherServiceSourceId = fields.otherServiceSourceId;
    this.otherServiceIntrasourceId = fields.otherServiceIntrasourceId;
  }

  with(
    fields: Partial<EntireVehicleFormsServiceConnectionFields>,
  ): EntireVehicleFormsServiceConnection {
    return new EntireVehicleFormsServiceConnection({ ...this, ...fields });
  }

  get type() {
    return "entire-vehicle-forms-service" as const;
  }
}

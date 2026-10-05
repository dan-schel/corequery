type GenericConnectionFields = {
  readonly direction: "from-other" | "to-other" | "bidirectional";
  readonly otherServiceSourceId: string;
  readonly otherServiceIntrasourceId: string;

  readonly movementIndex: number;
  readonly otherServiceMovementIndex: number;
};

// Some other type of connection. CoreQuery probably just shows this on the
// service page as "Connects to XYZ", without any further special logic.
export class GenericConnection {
  readonly direction: "from-other" | "to-other" | "bidirectional";
  readonly otherServiceSourceId: string;
  readonly otherServiceIntrasourceId: string;

  readonly movementIndex: number;
  readonly otherServiceMovementIndex: number;

  constructor(fields: GenericConnectionFields) {
    this.direction = fields.direction;
    this.otherServiceSourceId = fields.otherServiceSourceId;
    this.otherServiceIntrasourceId = fields.otherServiceIntrasourceId;

    this.movementIndex = fields.movementIndex;
    this.otherServiceMovementIndex = fields.otherServiceMovementIndex;
  }

  with(fields: Partial<GenericConnectionFields>): GenericConnection {
    return new GenericConnection({ ...this, ...fields });
  }

  get type() {
    return "other" as const;
  }
}

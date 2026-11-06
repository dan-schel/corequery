export class ArgsError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ArgsError";
  }
}

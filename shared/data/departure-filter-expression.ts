import { itsOk, nonNull } from "@dan-schel/js-utils";

export class DepartureFilterExpression {
  constructor(
    readonly disjunctions: readonly (readonly DepartureFilterToken[])[],
  ) {}

  static parse(input: string): DepartureFilterExpression | null {
    if (input.length === 0) return new DepartureFilterExpression([]);

    const disjunctionStrs = input.split(" ");

    const disjunctions: DepartureFilterToken[][] = [];

    for (const disjunctionStr of disjunctionStrs) {
      // Would happen if there was leading/trailing spaces.
      if (disjunctionStr.length === 0) return null;

      // DepartureFilterToken.parse doesn't support empty strings, so if there's
      // leading/trailing pipes, we'll get nulls in the array. We'll also get
      // nulls for any badly formed tokens.
      const tokenStrs = disjunctionStr.split("|");
      const tokens = tokenStrs
        .map((x) => DepartureFilterToken.parse(x))
        .filter(nonNull);

      // All tokens must be parsed correctly. Remember that while the departures
      // API is lenient with filter types and/or arguments that are no longer
      // valid, we do NOT need to be lenient with the syntax itself, which is
      // what we're parsing here!
      if (tokens.length !== tokenStrs.length) return null;

      disjunctions.push(tokens);
    }

    if (disjunctions.length === 0) return null;

    return new DepartureFilterExpression(disjunctions);
  }

  toString() {
    return this.disjunctions
      .map((d) => d.map((t) => t.toString()).join("|"))
      .join(" ");
  }
}

export class DepartureFilterToken {
  private constructor(
    readonly prefix: string,
    readonly args: string | null,
    readonly negated: boolean,
  ) {}

  static create(
    prefix: string,
    args: string | null,
    negated: boolean,
  ): DepartureFilterToken {
    if (!DepartureFilterToken.isValidPrefix(prefix)) {
      throw new Error(`Invalid prefix: ${prefix}`);
    }

    if (args != null && !/^[a-z0-9-]+$/.test(args)) {
      throw new Error(`Invalid args: ${args}`);
    }

    return new DepartureFilterToken(prefix, args, negated);
  }

  static parse(input: string): DepartureFilterToken | null {
    const match = input.match(/^(!?)([a-z0-9-]+)(:([a-z0-9-]+))?$/);
    if (match == null) return null;

    const negated = match[1] === "!";
    const prefix = itsOk(match[2]);
    const args = match[4] ?? null;

    return new DepartureFilterToken(prefix, args, negated);
  }

  static isValidPrefix(prefix: string): boolean {
    return /^[a-z0-9-]+$/.test(prefix);
  }

  toString() {
    let result = this.prefix;

    if (this.negated) {
      result = "!" + result;
    }

    if (this.args != null) {
      result += ":" + this.args;
    }

    return result;
  }
}

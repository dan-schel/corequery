import type { CustomDepartureFilterTypesConfig } from "@/server/config/types/custom-filter-function-type.js";
import type { Corequery } from "@/server/corequery.js";
import type { DepartureFilterType } from "@/server/data/departure-filters/departure-filter-type.js";
import { ArrivalDepartureFilterType } from "@/server/data/departure-filters/types/arrival.js";
import { CustomDepartureFilterType } from "@/server/data/departure-filters/types/custom.js";
import { LineTagDepartureFilterType } from "@/server/data/departure-filters/types/line-tag.js";
import { LineDepartureFilterType } from "@/server/data/departure-filters/types/line.js";
import { PositionDepartureFilterType } from "@/server/data/departure-filters/types/position.js";
import { ServiceTagDepartureFilterType } from "@/server/data/departure-filters/types/service-tag.js";
import { SetDownOnlyDepartureFilterType } from "@/server/data/departure-filters/types/set-down-only.js";
import type { Departure } from "@/server/data/service/departure.js";
import {
  DepartureFilterExpression,
  DepartureFilterToken,
} from "@/shared/data/departure-filter-expression.js";
import { nonNull } from "@dan-schel/js-utils";

export class DepartureFilters<CustomContextType> {
  constructor(
    private readonly _app: Corequery<CustomContextType>,
    private readonly _types: Map<
      string,
      DepartureFilterType<CustomContextType>
    >,
  ) {}

  static build<CustomContextType>(
    app: Corequery<CustomContextType>,
    customDepartureFilterTypes: CustomDepartureFilterTypesConfig<CustomContextType>,
  ) {
    const custom = customDepartureFilterTypes ?? [];

    const typesArray = [
      ...this.createBuiltInFunctions(app),
      ...custom.map((x) => CustomDepartureFilterType.build(app, x)),
    ];

    const typesMap = new Map<string, DepartureFilterType<CustomContextType>>();
    for (const type of typesArray) {
      if (typesMap.has(type.prefix)) {
        throw new Error(`Bad custom departure filter prefix "${type.prefix}".`);
      }
      typesMap.set(type.prefix, type);
    }

    return new DepartureFilters(app, typesMap);
  }

  static createBuiltInFunctions<CustomContextType>(
    app: Corequery<CustomContextType>,
  ): DepartureFilterType<CustomContextType>[] {
    return [
      new ArrivalDepartureFilterType(app),
      new LineTagDepartureFilterType(app),
      new LineDepartureFilterType(app),
      new PositionDepartureFilterType(app),
      new ServiceTagDepartureFilterType(app),
      new SetDownOnlyDepartureFilterType(app),
    ];
  }

  /**
   * Returns a `(departure: Departure) => boolean` function based on the
   * provided filter expression. The filter expression must be given in
   * conjunctive normal form (CNF), in the supported filter syntax.
   *
   * For example, `line:1|line:2 service-tag:1|service-tag:2 !arr` means the
   * departure must match all three conditions:
   * - It must be on line 1 or line 2.
   * - It must have service tag 1 or service tag 2.
   * - It must not be an arrival.
   *
   * Negation has the highest precedence, then disjunctions (a.k.a `|`, or OR),
   * and finally conjunctions (a.k.a spaces, or AND). Parentheses are not
   * allowed, so any complex expressions must be converted to CNF first.
   */
  compile(filterExpression: string) {
    const parsed = DepartureFilterExpression.parse(filterExpression);
    if (parsed == null) return null;

    const invalidTokens = new Set<DepartureFilterToken>();

    const disjunctions = parsed.disjunctions
      .map((disjunction) =>
        disjunction
          .map((token) => this._compileToken(token, invalidTokens))

          // Here, invalid tokens are just ignored, and output in the
          // `invalidTokens` array. We filter departures as though that filter
          // didn't exist.
          .filter(nonNull),
      )

      // If all the tokens in a disjunction were invalid, we'll need to drop the
      // disjunction entirely, since an empty disjunction would always evaluate
      // to false.
      .filter((x) => x.length > 0);

    const filterFunction = (departure: Departure) => {
      return disjunctions.every((disjunction) =>
        disjunction.some((fn) => fn(departure)),
      );
    };

    return { filterFunction, invalidTokens };
  }

  private _compileToken(
    token: DepartureFilterToken,
    invalidTokens: Set<DepartureFilterToken>,
  ): ((departure: Departure) => boolean) | null {
    const type = this._types.get(token.prefix);
    if (type == null) {
      invalidTokens.add(token);
      return null;
    }

    const fn = type.buildFilterFunction(token.args ?? "");
    if (fn == null) {
      invalidTokens.add(token);
      return null;
    }

    if (token.negated) {
      return (departure: Departure) => !fn(departure);
    } else {
      return fn;
    }
  }
}

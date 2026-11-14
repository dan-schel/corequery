import type {
  CustomDepartureFilterTypeConfig,
  CustomDepartureFilterTypeFunctionBuilder,
} from "@/server/config/types/custom-filter-function-type.js";
import type { Corequery } from "@/server/corequery.js";
import {
  DepartureFilterType,
  type DepartureFilterFunction,
} from "@/server/data/departure-filters/departure-filter-type.js";
import { DepartureFilterToken } from "@/shared/data/departure-filter-expression.js";

export class CustomDepartureFilterType<
  CustomContextType,
> extends DepartureFilterType<CustomContextType> {
  constructor(
    app: Corequery<CustomContextType>,
    prefix: string,
    private readonly _buildFilterFunction: CustomDepartureFilterTypeFunctionBuilder<CustomContextType>,
  ) {
    super(app, prefix);
  }

  static build<CustomContextType>(
    app: Corequery<CustomContextType>,
    config: CustomDepartureFilterTypeConfig<CustomContextType>,
  ) {
    if (!DepartureFilterToken.isValidPrefix(config.prefix)) {
      throw new Error(`Invalid prefix: ${config.prefix}`);
    }

    return new CustomDepartureFilterType(
      app,
      config.prefix,
      config.buildFilterFunction,
    );
  }

  override buildFilterFunction(args: string): DepartureFilterFunction | null {
    return this._buildFilterFunction(this._app, args);
  }
}

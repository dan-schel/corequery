import type { Corequery } from "@/server/corequery.js";
import type { DepartureFilterFunction } from "@/server/data/departure-filters/departure-filter-type.js";

export type CustomDepartureFilterTypesConfig<CustomContextType> =
  readonly CustomDepartureFilterTypeConfig<CustomContextType>[];

export type CustomDepartureFilterTypeConfig<CustomContextType> = {
  readonly prefix: string;
  readonly buildFilterFunction: CustomDepartureFilterTypeFunctionBuilder<CustomContextType>;
};

export type CustomDepartureFilterTypeFunctionBuilder<CustomContextType> = (
  app: Corequery<CustomContextType>,
  args: string,
) => DepartureFilterFunction | null;

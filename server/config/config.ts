import type {
  AboutPageConfig,
  AssetConfig,
  FooterConfig,
  LandingPageConfig,
  LineConfig,
  LinesPageConfig,
  StopConfig,
  TagsConfig,
  TerminologyConfig,
} from "@/server/config/types/index.js";
import type { Logger } from "@/server/logger/logger.js";
import type { GetCanonicalLinesServingStopConfig } from "@/server/config/types/get-canonical-lines-serving-stop-config.js";
import type { ServiceSourcesConfig } from "@/server/config/types/service-sources-config.js";
import type { GetDepartureFiltersForStopConfig } from "@/server/config/types/get-filters-for-stop-config.js";
import type { GetDefaultDepartureFeedsForStopConfig } from "@/server/config/types/get-default-departure-feeds-for-stop-config.js";
import type { CustomFilterFunctionConfig } from "@/server/config/types/custom-filter-function-config.js";

export type CorequeryConfig<CustomContextType = unknown> = {
  readonly logger: Logger;
  readonly port: number;
  readonly version: string;
  readonly assets: AssetConfig;
  readonly stops: readonly StopConfig[];
  readonly lines: readonly LineConfig[];
  readonly terminology: TerminologyConfig;
  readonly landingPage: LandingPageConfig;
  readonly footer: FooterConfig;
  readonly aboutPage: AboutPageConfig;
  readonly linesPage: LinesPageConfig;
  readonly tags: TagsConfig;
  readonly getCanonicalLinesServingStop: GetCanonicalLinesServingStopConfig;
  readonly getDefaultDepartureFeedsForStop: GetDefaultDepartureFeedsForStopConfig;
  readonly getDepartureFiltersForStop: GetDepartureFiltersForStopConfig;
  readonly customFilterFunctions?: readonly CustomFilterFunctionConfig<CustomContextType>[];
  readonly serviceSources: ServiceSourcesConfig;
  readonly custom: CustomContextType;
};

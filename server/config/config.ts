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

export type CorequeryConfig = {
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
};

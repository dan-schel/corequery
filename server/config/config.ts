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

export type CorequeryConfig = {
  readonly port: number;
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

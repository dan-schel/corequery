import type { AssetConfig } from "../web-server/asset-preparer.js";
import type { AboutPageConfig } from "./about-page-config.js";
import type { FooterConfig } from "./footer-config.js";
import type { LandingPageConfig } from "./landing-page-config.js";
import type { LineConfig } from "./line-config.js";
import type { LinesPageConfig } from "./lines-page-config.js";
import type { StopConfig } from "./stop-config.js";
import type { TagsConfig } from "./tags-config.js";
import type { Terminology } from "./terminology.js";

export type CorequeryConfig = {
  readonly port: number;
  readonly assets: AssetConfig;
  readonly stops: readonly StopConfig[];
  readonly lines: readonly LineConfig[];
  readonly terminology: Terminology;
  readonly landingPage: LandingPageConfig;
  readonly footer: FooterConfig;
  readonly aboutPage: AboutPageConfig;
  readonly linesPage: LinesPageConfig;
  readonly tags: TagsConfig;
};

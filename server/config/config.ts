import type { Stop } from "../data/stop.js";
import type { Line } from "../data/line.js";
import type { AssetConfig } from "../web-server/asset-preparer.js";
import type { AboutPageConfig } from "./about-page-config.js";
import type { FooterConfig } from "./footer-config.js";
import type { LandingPageConfig } from "./landing-page-config.js";
import type { LinesPageConfig } from "./lines-page-config.js";
import type { Terminology } from "./terminology.js";

export type CorequeryConfig = {
  readonly port: number;
  readonly assets: AssetConfig;
  readonly stops: readonly Stop[];
  readonly lines: readonly Line[];
  readonly terminology: Terminology;
  readonly landingPage: LandingPageConfig;
  readonly footer: FooterConfig;
  readonly aboutPage: AboutPageConfig;
  readonly linesPage: LinesPageConfig;
};

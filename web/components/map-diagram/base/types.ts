import type { ComponentChildren } from "preact";
import type { Theme } from "@/web/data/theme";

export type BaseMapDiagramCanvasData<Structure> = {
  structure: Structure;
  lightThemeColorHexCode: string | null;
  darkThemeColorHexCode: string | null;
  colorTheme: Theme;
};

export type StopStructure = {
  readonly content: ComponentChildren;
  readonly drawMark?: boolean;
  readonly getOverriddenMarkYPosition?: (contentDiv: HTMLElement) => number;
};

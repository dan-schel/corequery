import type { FodaLineDiagramEntry } from "@/web/data/foundational-data/foda-line-collection";
import { CanvasController } from "@/web/components/canvas/canvas-controller";
import { getColors, type Colors } from "@/web/components/canvas/colors";
import { itsOk } from "@dan-schel/js-utils";
import type { Theme } from "@/web/data/theme";

export type LineDiagramCanvasData = {
  diagram: FodaLineDiagramEntry;
  labelsParent: HTMLDivElement | null;
  colorTheme: Theme;
};

const NOTCH_WIDTH = 16;
const NOTCH_HEIGHT = 6;
const LINE_WIDTH = 6;

export class LineDiagramCanvasController extends CanvasController<LineDiagramCanvasData> {
  private readonly _css: Colors;
  private readonly _prefersDark: boolean;

  constructor(canvasContainer: HTMLDivElement, canvas: HTMLCanvasElement) {
    super(canvasContainer, canvas);

    this._css = getColors();
    this._prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
  }

  override onRender(): void {
    if (this.data.diagram.stops.length === 0) return;

    const labelYLevels = this._getLabelYLevels();
    if (labelYLevels.length !== this.data.diagram.stops.length) return;

    this.ctx.fillStyle = this._getDiagramColor();

    // TODO: Drawing two distinct rectangles doesn't work so well with partially
    // transparent colors. The better approach would probably be to draw it all
    // as one polygon, calculating and adding points for each notch.
    const topY = itsOk(labelYLevels[0]);
    const bottomY = itsOk(labelYLevels[labelYLevels.length - 1]);
    this.ctx.fillRect(
      (NOTCH_WIDTH - LINE_WIDTH) / 2,
      topY,
      LINE_WIDTH,
      bottomY - topY,
    );

    this.data.diagram.stops.forEach((stop, index) => {
      const labelY = itsOk(labelYLevels[index]);

      const fullSize =
        index === 0 || index === this.data.diagram.stops.length - 1;

      if (stop.type !== "always-express") {
        this.ctx.fillRect(
          fullSize ? 0 : NOTCH_WIDTH / 2,
          labelY - NOTCH_HEIGHT / 2,
          fullSize ? NOTCH_WIDTH : NOTCH_WIDTH / 2,
          NOTCH_HEIGHT,
        );
      }
    });
  }

  private _getDiagramColor() {
    const colorKey = {
      dark: "darkModeHexCode" as const,
      light: "lightModeHexCode" as const,
      auto: this._prefersDark
        ? ("darkModeHexCode" as const)
        : ("lightModeHexCode" as const),
    }[this.data.colorTheme];

    return this.data.diagram.color?.[colorKey] ?? this._css.fg;
  }

  private _getLabelYLevels() {
    return Array.from(this.data.labelsParent?.childNodes.values() ?? [])
      .filter((node): node is HTMLElement => node instanceof HTMLElement)
      .map((label) => label.offsetTop + label.offsetHeight / 2);
  }
}

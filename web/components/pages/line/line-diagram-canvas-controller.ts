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

    // The strokes can be drawn literally whatever color we want, we use
    // `globalCompositeOperation` below to draw the color over them, and
    // essentially use these strokes as a mask.
    this.ctx.strokeStyle = "#000000";

    const topY = itsOk(labelYLevels[0]);
    const bottomY = itsOk(labelYLevels[labelYLevels.length - 1]);

    this.ctx.lineWidth = LINE_WIDTH;
    this.ctx.beginPath();
    this.ctx.moveTo(NOTCH_WIDTH / 2, topY);
    this.ctx.lineTo(NOTCH_WIDTH / 2, bottomY);
    this.ctx.stroke();

    this.data.diagram.stops.forEach((stop, index) => {
      const labelY = itsOk(labelYLevels[index]);

      const fullSize =
        index === 0 || index === this.data.diagram.stops.length - 1;

      if (stop.type !== "always-express") {
        this.ctx.lineWidth = NOTCH_HEIGHT;
        this.ctx.beginPath();
        this.ctx.moveTo(fullSize ? 0 : NOTCH_WIDTH / 2, labelY);
        this.ctx.lineTo(NOTCH_WIDTH, labelY);
        this.ctx.stroke();
      }
    });

    // Fill over the whole canvas with the chosen color. The strokes become the
    // mask.
    this.ctx.globalCompositeOperation = "source-in";
    this.ctx.fillStyle = this._getDiagramColor();
    this.ctx.fillRect(0, 0, this.width, this.height);
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

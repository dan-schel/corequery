import { CanvasController } from "@/web/components/canvas/canvas-controller";
import { getColors, type Colors } from "@/web/components/canvas/colors";
import { itsOk } from "@dan-schel/js-utils";
import type { Theme } from "@/web/data/theme";
import type { StopStructure } from "@/web/components/map-diagram/types";

export type BaseMapDiagramCanvasData<Structure> = {
  structure: Structure;
  lightThemeColorHexCode: string | null;
  darkThemeColorHexCode: string | null;
  colorTheme: Theme;
};

const NOTCH_WIDTH = 16;
const NOTCH_HEIGHT = 6;
const LINE_WIDTH = 6;
const BRANCH_OFFSET = 10;
const SECTION_LINE_OVERSHOOT = 1;

export abstract class BaseMapDiagramController<
  Structure,
> extends CanvasController<BaseMapDiagramCanvasData<Structure>> {
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
    // The strokes can be drawn literally whatever color we want, we use
    // `globalCompositeOperation` below to draw the color over them, and
    // essentially use these strokes as a mask.
    this.ctx.strokeStyle = "#000000";

    this.onRenderStructure(this.data.structure);

    // Fill over the whole canvas with the chosen color. The strokes become the
    // mask.
    this.ctx.globalCompositeOperation = "source-in";
    this.ctx.fillStyle = this._getDiagramColor();
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  protected abstract onRenderStructure(structure: Structure): void;

  protected renderSection({
    stops,
    x,
    yLevels,
    terminatesAtTop,
    terminatesAtBottom,
    notchSide,
  }: {
    stops: readonly StopStructure[];
    x: number;
    yLevels: number[];
    terminatesAtTop: boolean;
    terminatesAtBottom: boolean;
    notchSide: "left" | "right";
  }) {
    if (stops.length < 1) throw new Error("Expecting at least one stop.");
    if (stops.length !== yLevels.length) throw new Error("Bad length.");

    const topY = itsOk(yLevels[0]);
    const bottomY = itsOk(yLevels[yLevels.length - 1]);

    this.ctx.lineWidth = LINE_WIDTH;
    this.ctx.beginPath();
    this.ctx.moveTo(x, topY - SECTION_LINE_OVERSHOOT);
    this.ctx.lineTo(x, bottomY + SECTION_LINE_OVERSHOOT);
    this.ctx.stroke();

    const dir = { left: -1, right: 1 }[notchSide];

    stops.forEach((stop, index) => {
      const labelY = itsOk(yLevels[index]);

      const termination =
        (index === 0 && terminatesAtTop) ||
        (index === stops.length - 1 && terminatesAtBottom);

      if (stop.drawMark ?? true) {
        this.ctx.lineWidth = NOTCH_HEIGHT;

        this.ctx.beginPath();
        this.ctx.moveTo(termination ? x - (NOTCH_WIDTH / 2) * dir : x, labelY);
        this.ctx.lineTo(x + (NOTCH_WIDTH / 2) * dir, labelY);
        this.ctx.stroke();
      }
    });
  }

  protected extractYLevels(stops: readonly StopStructure[], inner: string) {
    const contentPerStop = this.extractChildElements(inner);
    if (stops.length !== contentPerStop.length) throw new Error("Bad length.");

    return stops.map((stop, i) => {
      const content = itsOk(contentPerStop[i]);

      if (stop.getOverriddenMarkYPosition != null) {
        return stop.getOverriddenMarkYPosition(content);
      } else {
        return this.getDefaultMarkYPosition(content);
      }
    });
  }

  protected extractChildElements(inner: string): HTMLElement[] {
    const target = this._canvasContainer.parentElement?.querySelector(
      `.${inner}`,
    );
    if (target == null) throw new Error(`Couldn't find "${inner}".`);

    return Array.from(target.childNodes.values()).filter(
      (node): node is HTMLElement => node instanceof HTMLElement,
    );
  }

  protected getDefaultMarkYPosition(content: HTMLElement) {
    const containerRect = this._canvasContainer.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    return contentRect.top - containerRect.top + contentRect.height / 2;
  }

  protected get notchWidth() {
    return NOTCH_WIDTH;
  }

  protected get lineWidth() {
    return LINE_WIDTH;
  }

  protected get branchOffset() {
    return BRANCH_OFFSET;
  }

  protected get sectionLineOvershoot() {
    return SECTION_LINE_OVERSHOOT;
  }

  private _getDiagramColor() {
    const colorKey = {
      dark: "darkThemeColorHexCode" as const,
      light: "lightThemeColorHexCode" as const,
      auto: this._prefersDark
        ? ("darkThemeColorHexCode" as const)
        : ("lightThemeColorHexCode" as const),
    }[this.data.colorTheme];

    return this.data[colorKey] ?? this._css.fg;
  }
}

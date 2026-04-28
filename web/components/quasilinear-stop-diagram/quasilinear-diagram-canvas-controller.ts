import { CanvasController } from "@/web/components/canvas/canvas-controller";
import { getColors, type Colors } from "@/web/components/canvas/colors";
import { itsOk } from "@dan-schel/js-utils";
import type { Theme } from "@/web/data/theme";
import type {
  LinearStopDiagramStructure,
  QuasilinearStopDiagramStructure,
  StopStructure,
} from "@/web/components/quasilinear-stop-diagram/structure-types";
import { th } from "zod/locales";

export type QuasilinearStopDiagramCanvasData = {
  structure: QuasilinearStopDiagramStructure;
  lightThemeColorHexCode: string;
  darkThemeColorHexCode: string;
  contentParent: HTMLDivElement | null;
  colorTheme: Theme;
};

const NOTCH_WIDTH = 16;
const NOTCH_HEIGHT = 6;
const LINE_WIDTH = 6;

export class QuasilinearStopDiagramCanvasController extends CanvasController<QuasilinearStopDiagramCanvasData> {
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
    if (this.data.contentParent == null) return;

    // The strokes can be drawn literally whatever color we want, we use
    // `globalCompositeOperation` below to draw the color over them, and
    // essentially use these strokes as a mask.
    this.ctx.strokeStyle = "#000000";

    if (this.data.structure.type === "linear") {
      this._renderLinear(this.data.structure, this.data.contentParent);
    } else {
      this.data.structure.type satisfies never;
      throw new Error("Unknown structure type");
    }

    // Fill over the whole canvas with the chosen color. The strokes become the
    // mask.
    this.ctx.globalCompositeOperation = "source-in";
    this.ctx.fillStyle = this._getDiagramColor();
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  private _renderLinear(
    structure: LinearStopDiagramStructure,
    contentParent: HTMLDivElement,
  ) {
    const contentPerStop = this._extractChildElements(contentParent);

    this._renderSection({
      stops: structure.stops,
      x: NOTCH_WIDTH / 2,
      contentPerStop,
      terminatesAtTop: true,
      terminatesAtBottom: true,
    });
  }

  private _renderSection({
    stops,
    x,
    contentPerStop,
    terminatesAtTop,
    terminatesAtBottom,
  }: {
    stops: readonly StopStructure[];
    x: number;
    contentPerStop: HTMLElement[];
    terminatesAtTop: boolean;
    terminatesAtBottom: boolean;
  }) {
    if (stops.length < 1) throw new Error("Expecting at least one stop.");
    if (stops.length !== contentPerStop.length) throw new Error("Bad length.");

    const labelYLevels = stops.map((stop, i) => {
      const content = itsOk(contentPerStop[i]);

      if (stop.getOverriddenMarkYPosition != null) {
        return stop.getOverriddenMarkYPosition(content);
      } else {
        return this._getDefaultMarkYPosition(content);
      }
    });

    const topY = itsOk(labelYLevels[0]);
    const bottomY = itsOk(labelYLevels[labelYLevels.length - 1]);

    this.ctx.lineWidth = LINE_WIDTH;
    this.ctx.beginPath();
    this.ctx.moveTo(x, topY);
    this.ctx.lineTo(x, bottomY);
    this.ctx.stroke();

    stops.forEach((stop, index) => {
      const labelY = itsOk(labelYLevels[index]);

      const termination =
        (index === 0 && terminatesAtTop) ||
        (index === stops.length - 1 && terminatesAtBottom);

      if (stop.drawMark ?? true) {
        this.ctx.lineWidth = NOTCH_HEIGHT;
        this.ctx.beginPath();
        this.ctx.moveTo(termination ? x - NOTCH_WIDTH / 2 : x, labelY);
        this.ctx.lineTo(NOTCH_WIDTH, labelY);
        this.ctx.stroke();
      }
    });
  }

  private _extractChildElements(parent: HTMLDivElement): HTMLElement[] {
    return Array.from(parent.childNodes.values()).filter(
      (node): node is HTMLElement => node instanceof HTMLElement,
    );
  }

  private _getDefaultMarkYPosition(content: HTMLElement) {
    const containerRect = this._canvasContainer.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    return contentRect.top - containerRect.top + contentRect.height / 2;
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

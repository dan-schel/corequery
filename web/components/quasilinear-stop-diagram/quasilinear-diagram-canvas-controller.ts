import { CanvasController } from "@/web/components/canvas/canvas-controller";
import { getColors, type Colors } from "@/web/components/canvas/colors";
import { assertNever, itsOk } from "@dan-schel/js-utils";
import type { Theme } from "@/web/data/theme";
import type {
  BranchStopDiagramStructure,
  LinearStopDiagramStructure,
  LoopStopDiagramStructure,
  QuasilinearStopDiagramStructure,
  StopStructure,
} from "@/web/components/quasilinear-stop-diagram/structure-types";
import {
  BRANCH_A_STOPS_SECTION_CLASS,
  BRANCH_B_STOPS_SECTION_CLASS,
  COMMON_STOPS_SECTION_CLASS,
} from "@/web/components/quasilinear-stop-diagram/layout/BranchLayout";
import {
  LOOP_LEFT_STOPS_SECTION_CLASS,
  LOOP_RIGHT_STOPS_SECTION_CLASS,
  MAIN_STOPS_SECTION_CLASS,
} from "@/web/components/quasilinear-stop-diagram/layout/LoopLayout";

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
const BRANCH_OFFSET = 10;
const BRANCH_CURVE_BEZIER_OFFSET = 15;
const LOOP_CURVE_BEZIER_OFFSET = 24;
const SECTION_LINE_OVERSHOOT = 1;

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
    } else if (this.data.structure.type === "branch") {
      this._renderBranch(this.data.structure, this.data.contentParent);
    } else if (this.data.structure.type === "loop") {
      this._renderLoop(this.data.structure, this.data.contentParent);
    } else {
      assertNever(this.data.structure);
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
    this._renderSection({
      stops: structure.stops,
      x: this.width / 2,
      yLevels: this._extractYLevels(structure.stops, contentParent),
      terminatesAtTop: true,
      terminatesAtBottom: true,
      notchSide: "right",
    });
  }

  private _renderBranch(
    structure: BranchStopDiagramStructure,
    contentParent: HTMLDivElement,
  ) {
    const commonYLevels = this._extractYLevels(
      structure.commonStops,
      contentParent,
      COMMON_STOPS_SECTION_CLASS,
    );
    const branchAYLevels = this._extractYLevels(
      structure.branchAStops,
      contentParent,
      BRANCH_A_STOPS_SECTION_CLASS,
    );
    const branchBYLevels = this._extractYLevels(
      structure.branchBStops,
      contentParent,
      BRANCH_B_STOPS_SECTION_CLASS,
    );

    const commonX = this.width / 2;
    const branchAX = NOTCH_WIDTH / 2;
    const branchBX = this.width - NOTCH_WIDTH / 2;

    this._renderSection({
      stops: structure.commonStops,
      x: commonX,
      yLevels: commonYLevels,
      terminatesAtTop: true,
      terminatesAtBottom: false,
      notchSide: "right",
    });
    this._renderSection({
      stops: structure.branchAStops,
      x: branchAX,
      yLevels: branchAYLevels,
      terminatesAtTop: false,
      terminatesAtBottom: true,
      notchSide: "left",
    });
    this._renderSection({
      stops: structure.branchBStops,
      x: branchBX,
      yLevels: branchBYLevels,
      terminatesAtTop: false,
      terminatesAtBottom: true,
      notchSide: "right",
    });

    const commonBottomY = itsOk(commonYLevels[commonYLevels.length - 1]);
    const branchATopY = itsOk(branchAYLevels[0]);
    const branchBTopY = itsOk(branchBYLevels[0]);
    const branchCommomTopY = Math.min(branchATopY, branchBTopY);

    this.ctx.lineWidth = LINE_WIDTH;
    this.ctx.beginPath();
    this.ctx.moveTo(commonX, commonBottomY);

    // From the bottom of common to the top of branch A.
    this.ctx.lineTo(commonX, commonBottomY + BRANCH_OFFSET);
    this.ctx.bezierCurveTo(
      commonX,
      commonBottomY + BRANCH_CURVE_BEZIER_OFFSET + BRANCH_OFFSET,
      branchAX,
      branchCommomTopY - BRANCH_CURVE_BEZIER_OFFSET,
      branchAX,
      branchCommomTopY,
    );
    this.ctx.lineTo(branchAX, branchATopY);

    // From the bottom of common to the top of branch B.
    this.ctx.moveTo(commonX, commonBottomY + BRANCH_OFFSET);
    this.ctx.bezierCurveTo(
      commonX,
      commonBottomY + BRANCH_CURVE_BEZIER_OFFSET + BRANCH_OFFSET,
      branchBX,
      branchCommomTopY - BRANCH_CURVE_BEZIER_OFFSET,
      branchBX,
      branchCommomTopY,
    );
    this.ctx.lineTo(branchBX, branchBTopY);

    this.ctx.stroke();
  }

  private _renderLoop(
    structure: LoopStopDiagramStructure,
    contentParent: HTMLDivElement,
  ) {
    const loopLeftYLevels = this._extractYLevels(
      structure.loopLeftStops,
      contentParent,
      LOOP_LEFT_STOPS_SECTION_CLASS,
    );
    const loopRightYLevels = this._extractYLevels(
      structure.loopRightStops,
      contentParent,
      LOOP_RIGHT_STOPS_SECTION_CLASS,
    );
    const mainYLevels = this._extractYLevels(
      structure.mainStops,
      contentParent,
      MAIN_STOPS_SECTION_CLASS,
    );

    const loopLeftX = NOTCH_WIDTH / 2;
    const loopRightX = this.width - NOTCH_WIDTH / 2;
    const mainX = this.width / 2;

    this._renderSection({
      stops: structure.loopLeftStops,
      x: loopLeftX,
      yLevels: loopLeftYLevels,
      terminatesAtTop: false,
      terminatesAtBottom: false,
      notchSide: "left",
    });
    this._renderSection({
      stops: structure.loopRightStops,
      x: loopRightX,
      yLevels: loopRightYLevels,
      terminatesAtTop: false,
      terminatesAtBottom: false,
      notchSide: "right",
    });
    this._renderSection({
      stops: structure.mainStops,
      x: mainX,
      yLevels: mainYLevels,
      terminatesAtTop: false,
      terminatesAtBottom: true,
      notchSide: "right",
    });

    const mainTopY = itsOk(mainYLevels[0]);
    const loopLeftBottomY = itsOk(loopLeftYLevels[loopLeftYLevels.length - 1]);
    const loopRightBottomY = itsOk(
      loopRightYLevels[loopRightYLevels.length - 1],
    );
    const loopLeftTopY = itsOk(loopLeftYLevels[0]);
    const loopRightTopY = itsOk(loopRightYLevels[0]);
    const loopCommonBottomY = Math.max(loopLeftBottomY, loopRightBottomY);
    const loopCommonTopY = Math.min(loopLeftTopY, loopRightTopY);

    this.ctx.lineWidth = LINE_WIDTH;
    this.ctx.beginPath();
    this.ctx.moveTo(mainX, mainTopY);

    // From the top of main to the bottom of loop left.
    this.ctx.lineTo(mainX, mainTopY - BRANCH_OFFSET);
    this.ctx.bezierCurveTo(
      mainX,
      mainTopY - BRANCH_CURVE_BEZIER_OFFSET - BRANCH_OFFSET,
      loopLeftX,
      loopCommonBottomY + BRANCH_CURVE_BEZIER_OFFSET,
      loopLeftX,
      loopCommonBottomY,
    );
    this.ctx.lineTo(loopLeftX, loopLeftBottomY);

    // From the top of main to the bottom of loop right.
    this.ctx.moveTo(mainX, mainTopY - BRANCH_OFFSET);
    this.ctx.bezierCurveTo(
      mainX,
      mainTopY - BRANCH_CURVE_BEZIER_OFFSET - BRANCH_OFFSET,
      loopRightX,
      loopCommonBottomY + BRANCH_CURVE_BEZIER_OFFSET,
      loopRightX,
      loopCommonBottomY,
    );
    this.ctx.lineTo(loopRightX, loopRightBottomY);

    // From the top of loop left to the top of loop right.
    this.ctx.moveTo(loopLeftX, loopLeftTopY);
    this.ctx.lineTo(loopLeftX, loopCommonTopY);
    this.ctx.bezierCurveTo(
      loopLeftX,
      loopCommonTopY - LOOP_CURVE_BEZIER_OFFSET,
      loopRightX,
      loopCommonTopY - LOOP_CURVE_BEZIER_OFFSET,
      loopRightX,
      loopCommonTopY,
    );
    this.ctx.lineTo(loopRightX, loopRightTopY);

    this.ctx.stroke();
  }

  private _renderSection({
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

  private _extractYLevels(
    stops: readonly StopStructure[],
    parent: HTMLDivElement,
    inner?: string,
  ) {
    const contentPerStop = this._extractChildElements(parent, inner);
    if (stops.length !== contentPerStop.length) throw new Error("Bad length.");

    return stops.map((stop, i) => {
      const content = itsOk(contentPerStop[i]);

      if (stop.getOverriddenMarkYPosition != null) {
        return stop.getOverriddenMarkYPosition(content);
      } else {
        return this._getDefaultMarkYPosition(content);
      }
    });
  }

  private _extractChildElements(
    parent: HTMLDivElement,
    inner?: string,
  ): HTMLElement[] {
    const target = inner == null ? parent : parent.querySelector(`.${inner}`);
    if (target == null) throw new Error(`Couldn't find "${inner}".`);

    return Array.from(target.childNodes.values()).filter(
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

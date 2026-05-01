import { itsOk } from "@dan-schel/js-utils";
import type { LoopMapDiagramStructure } from "@/web/components/map-diagram/loop/types";
import {
  BaseMapDiagramController,
  NOTCH_WIDTH,
} from "@/web/components/map-diagram/base/controller";
import {
  LOOP_LEFT_STOPS_SECTION_CLASS,
  LOOP_RIGHT_STOPS_SECTION_CLASS,
  MAIN_STOPS_SECTION_CLASS,
} from "@/web/components/map-diagram/loop";

const BRANCH_OFFSET = 10;
const BRANCH_CURVE_BEZIER_OFFSET = 15;
const LOOP_CURVE_BEZIER_OFFSET = 24;
const OVERSHOOT = 1;

export class LoopMapDiagramController extends BaseMapDiagramController<LoopMapDiagramStructure> {
  protected override _onRenderStructure() {
    // TODO: Plz refactor:
    //
    // - Logic for calculating the Y levels is messily named, and hard to
    //   follow. Can be nicer when the classes are split.
    //
    // - Can we unit test it somehow? It'd be nice to make sure the loop layout
    //   handles all cases, for example.

    const structure = this.data.structure;

    const loopLeftYLevels = this._extractYLevels(
      structure.loopLeftStops,
      LOOP_LEFT_STOPS_SECTION_CLASS,
    );
    const loopRightYLevels = this._extractYLevels(
      structure.loopRightStops,
      LOOP_RIGHT_STOPS_SECTION_CLASS,
    );
    const mainYLevels = this._extractYLevels(
      structure.mainStops,
      MAIN_STOPS_SECTION_CLASS,
    );

    const loopLeftX = NOTCH_WIDTH / 2;
    const loopRightX = this.width - NOTCH_WIDTH / 2;
    const mainX = this.width / 2;

    const loopLeftBottomActualY = loopLeftYLevels[loopLeftYLevels.length - 1];
    const loopRightBottomActualY =
      loopRightYLevels[loopRightYLevels.length - 1];
    const loopLeftBottomY = itsOk(
      loopLeftBottomActualY ?? loopRightBottomActualY,
    );
    const loopRightBottomY = itsOk(
      loopRightBottomActualY ?? loopLeftBottomActualY,
    );
    const loopLeftTopActualY = loopLeftYLevels[0];
    const loopRightTopActualY = loopRightYLevels[0];
    const loopLeftTopY = itsOk(loopLeftTopActualY ?? loopRightTopActualY);
    const loopRightTopY = itsOk(loopRightTopActualY ?? loopLeftTopActualY);

    if (structure.loopLeftStops.length > 0) {
      this._renderSection({
        stops: structure.loopLeftStops,
        x: loopLeftX,
        yLevels: loopLeftYLevels,
        terminatesAtTop: false,
        terminatesAtBottom: false,
        notchSide: "left",
      });
    } else {
      this._drawLine((ctx) => {
        ctx.moveTo(loopLeftX, loopLeftTopY - OVERSHOOT);
        ctx.lineTo(loopLeftX, loopLeftBottomY + OVERSHOOT);
      });
    }

    if (structure.loopRightStops.length > 0) {
      this._renderSection({
        stops: structure.loopRightStops,
        x: loopRightX,
        yLevels: loopRightYLevels,
        terminatesAtTop: false,
        terminatesAtBottom: false,
        notchSide: "right",
      });
    } else {
      this._drawLine((ctx) => {
        ctx.moveTo(loopRightX, loopRightTopY - OVERSHOOT);
        ctx.lineTo(loopRightX, loopRightBottomY + OVERSHOOT);
      });
    }

    const loopCommonBottomY = Math.max(loopLeftBottomY, loopRightBottomY);

    if (structure.mainStops.length > 0) {
      const mainTopY = itsOk(mainYLevels[0]);

      this._renderSection({
        stops: structure.mainStops,
        x: mainX,
        yLevels: mainYLevels,
        terminatesAtTop: false,
        terminatesAtBottom: true,
        notchSide: "right",
      });

      this._drawLine((ctx) => {
        // From the top of main to the bottom of loop left.
        ctx.moveTo(mainX, mainTopY);
        ctx.lineTo(mainX, mainTopY - BRANCH_OFFSET);
        ctx.bezierCurveTo(
          mainX,
          mainTopY - BRANCH_CURVE_BEZIER_OFFSET - BRANCH_OFFSET,
          loopLeftX,
          loopCommonBottomY + BRANCH_CURVE_BEZIER_OFFSET,
          loopLeftX,
          loopCommonBottomY,
        );
        ctx.lineTo(loopLeftX, loopLeftBottomY);

        // From the top of main to the bottom of loop right.
        ctx.moveTo(mainX, mainTopY - BRANCH_OFFSET);
        ctx.bezierCurveTo(
          mainX,
          mainTopY - BRANCH_CURVE_BEZIER_OFFSET - BRANCH_OFFSET,
          loopRightX,
          loopCommonBottomY + BRANCH_CURVE_BEZIER_OFFSET,
          loopRightX,
          loopCommonBottomY,
        );
        ctx.lineTo(loopRightX, loopRightBottomY);
      });

      this.ctx.stroke();
    } else {
      // From the bottom of loop left to the bottom of loop right.
      this._drawLine((ctx) => {
        ctx.moveTo(loopLeftX, loopLeftBottomY);
        ctx.lineTo(loopLeftX, loopCommonBottomY);
        ctx.bezierCurveTo(
          loopLeftX,
          loopCommonBottomY + LOOP_CURVE_BEZIER_OFFSET,
          loopRightX,
          loopCommonBottomY + LOOP_CURVE_BEZIER_OFFSET,
          loopRightX,
          loopCommonBottomY,
        );
        ctx.lineTo(loopRightX, loopRightBottomY);
      });
    }

    const loopCommonTopY = Math.min(loopLeftTopY, loopRightTopY);

    // From the top of loop left to the top of loop right.
    this._drawLine((ctx) => {
      ctx.moveTo(loopLeftX, loopLeftTopY);
      ctx.lineTo(loopLeftX, loopCommonTopY);
      ctx.bezierCurveTo(
        loopLeftX,
        loopCommonTopY - LOOP_CURVE_BEZIER_OFFSET,
        loopRightX,
        loopCommonTopY - LOOP_CURVE_BEZIER_OFFSET,
        loopRightX,
        loopCommonTopY,
      );
      ctx.lineTo(loopRightX, loopRightTopY);
    });
  }
}

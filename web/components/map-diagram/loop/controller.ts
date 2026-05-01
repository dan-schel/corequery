import { itsOk } from "@dan-schel/js-utils";
import type { LoopMapDiagramStructure } from "@/web/components/map-diagram/loop/types";
import { BaseMapDiagramController } from "@/web/components/map-diagram/base-controller";
import {
  LOOP_LEFT_STOPS_SECTION_CLASS,
  LOOP_RIGHT_STOPS_SECTION_CLASS,
  MAIN_STOPS_SECTION_CLASS,
} from "@/web/components/map-diagram/loop";

const BRANCH_CURVE_BEZIER_OFFSET = 15;
const LOOP_CURVE_BEZIER_OFFSET = 24;

export class LoopMapDiagramController extends BaseMapDiagramController<LoopMapDiagramStructure> {
  protected override onRenderStructure(structure: LoopMapDiagramStructure) {
    // TODO: Plz refactor:
    //
    // - A common line rendering method.
    //
    // - Logic for calculating the Y levels is messily named, and hard to
    //   follow. Can be nicer when the classes are split.
    //
    // - Do expected length checks upfront, don't rely on itsOk(), because
    //   sometimes it's not OK. If the structure doesn't pass validation, then
    //   have a nice fallback. Maybe the <...Layout> components should handle
    //   this though, not the canvas. Another argument for co-locating the
    //   render logic with the <...Layout> components!
    //
    // - Can we unit test it somehow? It'd be nice to make sure the loop layout
    //   handles all cases, for example.

    const loopLeftYLevels = this.extractYLevels(
      structure.loopLeftStops,
      LOOP_LEFT_STOPS_SECTION_CLASS,
    );
    const loopRightYLevels = this.extractYLevels(
      structure.loopRightStops,
      LOOP_RIGHT_STOPS_SECTION_CLASS,
    );
    const mainYLevels = this.extractYLevels(
      structure.mainStops,
      MAIN_STOPS_SECTION_CLASS,
    );

    const loopLeftX = this.notchWidth / 2;
    const loopRightX = this.width - this.notchWidth / 2;
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
      this.renderSection({
        stops: structure.loopLeftStops,
        x: loopLeftX,
        yLevels: loopLeftYLevels,
        terminatesAtTop: false,
        terminatesAtBottom: false,
        notchSide: "left",
      });
    } else {
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(loopLeftX, loopLeftTopY - this.sectionLineOvershoot);
      this.ctx.lineTo(loopLeftX, loopLeftBottomY + this.sectionLineOvershoot);
      this.ctx.stroke();
    }

    if (structure.loopRightStops.length > 0) {
      this.renderSection({
        stops: structure.loopRightStops,
        x: loopRightX,
        yLevels: loopRightYLevels,
        terminatesAtTop: false,
        terminatesAtBottom: false,
        notchSide: "right",
      });
    } else {
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(loopRightX, loopRightTopY - this.sectionLineOvershoot);
      this.ctx.lineTo(loopRightX, loopRightBottomY + this.sectionLineOvershoot);
      this.ctx.stroke();
    }

    const loopCommonBottomY = Math.max(loopLeftBottomY, loopRightBottomY);

    if (structure.mainStops.length > 0) {
      const mainTopY = itsOk(mainYLevels[0]);

      this.renderSection({
        stops: structure.mainStops,
        x: mainX,
        yLevels: mainYLevels,
        terminatesAtTop: false,
        terminatesAtBottom: true,
        notchSide: "right",
      });

      this.ctx.lineWidth = this.lineWidth;
      this.ctx.beginPath();

      // From the top of main to the bottom of loop left.
      this.ctx.moveTo(mainX, mainTopY);
      this.ctx.lineTo(mainX, mainTopY - this.branchOffset);
      this.ctx.bezierCurveTo(
        mainX,
        mainTopY - BRANCH_CURVE_BEZIER_OFFSET - this.branchOffset,
        loopLeftX,
        loopCommonBottomY + BRANCH_CURVE_BEZIER_OFFSET,
        loopLeftX,
        loopCommonBottomY,
      );
      this.ctx.lineTo(loopLeftX, loopLeftBottomY);

      // From the top of main to the bottom of loop right.
      this.ctx.moveTo(mainX, mainTopY - this.branchOffset);
      this.ctx.bezierCurveTo(
        mainX,
        mainTopY - BRANCH_CURVE_BEZIER_OFFSET - this.branchOffset,
        loopRightX,
        loopCommonBottomY + BRANCH_CURVE_BEZIER_OFFSET,
        loopRightX,
        loopCommonBottomY,
      );
      this.ctx.lineTo(loopRightX, loopRightBottomY);

      this.ctx.stroke();
    } else {
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.beginPath();

      // From the bottom of loop left to the bottom of loop right.
      this.ctx.moveTo(loopLeftX, loopLeftBottomY);
      this.ctx.lineTo(loopLeftX, loopCommonBottomY);
      this.ctx.bezierCurveTo(
        loopLeftX,
        loopCommonBottomY + LOOP_CURVE_BEZIER_OFFSET,
        loopRightX,
        loopCommonBottomY + LOOP_CURVE_BEZIER_OFFSET,
        loopRightX,
        loopCommonBottomY,
      );
      this.ctx.lineTo(loopRightX, loopRightBottomY);

      this.ctx.stroke();
    }

    const loopCommonTopY = Math.min(loopLeftTopY, loopRightTopY);

    this.ctx.lineWidth = this.lineWidth;
    this.ctx.beginPath();

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
}

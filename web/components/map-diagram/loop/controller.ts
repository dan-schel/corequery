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
    const { loopLeftStops, loopRightStops, mainStops } = this.data.structure;
    const { x, y } = this._measure();

    if (loopLeftStops.length > 0) {
      this._renderSection({
        stops: loopLeftStops,
        x: x.loopLeft,
        yLevels: y.loopLeft.all,
        terminatesAtTop: false,
        terminatesAtBottom: false,
        notchSide: "left",
      });
    } else {
      this._drawLine((ctx) => {
        ctx.moveTo(x.loopLeft, y.loopLeft.top - OVERSHOOT);
        ctx.lineTo(x.loopLeft, y.loopLeft.bottom + OVERSHOOT);
      });
    }

    if (loopRightStops.length > 0) {
      this._renderSection({
        stops: loopRightStops,
        x: x.loopRight,
        yLevels: y.loopRight.all,
        terminatesAtTop: false,
        terminatesAtBottom: false,
        notchSide: "right",
      });
    } else {
      this._drawLine((ctx) => {
        ctx.moveTo(x.loopRight, y.loopRight.top - OVERSHOOT);
        ctx.lineTo(x.loopRight, y.loopRight.bottom + OVERSHOOT);
      });
    }

    if (mainStops.length > 0) {
      const yMainTop = itsOk(y.main.top);

      this._renderSection({
        stops: mainStops,
        x: x.main,
        yLevels: y.main.all,
        terminatesAtTop: false,
        terminatesAtBottom: true,
        notchSide: "right",
      });

      this._drawLine((ctx) => {
        // From the top of main to the bottom of loop left.
        ctx.moveTo(x.main, yMainTop);
        ctx.lineTo(x.main, yMainTop - BRANCH_OFFSET);
        ctx.bezierCurveTo(
          x.main,
          yMainTop - BRANCH_CURVE_BEZIER_OFFSET - BRANCH_OFFSET,
          x.loopLeft,
          y.loop.bottom + BRANCH_CURVE_BEZIER_OFFSET,
          x.loopLeft,
          y.loop.bottom,
        );
        ctx.lineTo(x.loopLeft, y.loopLeft.bottom);

        // From the top of main to the bottom of loop right.
        ctx.moveTo(x.main, yMainTop - BRANCH_OFFSET);
        ctx.bezierCurveTo(
          x.main,
          yMainTop - BRANCH_CURVE_BEZIER_OFFSET - BRANCH_OFFSET,
          x.loopRight,
          y.loop.bottom + BRANCH_CURVE_BEZIER_OFFSET,
          x.loopRight,
          y.loop.bottom,
        );
        ctx.lineTo(x.loopRight, y.loopRight.bottom);
      });

      this.ctx.stroke();
    } else {
      // From the bottom of loop left to the bottom of loop right.
      this._drawLine((ctx) => {
        ctx.moveTo(x.loopLeft, y.loopLeft.bottom);
        ctx.lineTo(x.loopLeft, y.loop.bottom);
        ctx.bezierCurveTo(
          x.loopLeft,
          y.loop.bottom + LOOP_CURVE_BEZIER_OFFSET,
          x.loopRight,
          y.loop.bottom + LOOP_CURVE_BEZIER_OFFSET,
          x.loopRight,
          y.loop.bottom,
        );
        ctx.lineTo(x.loopRight, y.loopRight.bottom);
      });
    }

    // From the top of loop left to the top of loop right.
    this._drawLine((ctx) => {
      ctx.moveTo(x.loopLeft, y.loopLeft.top);
      ctx.lineTo(x.loopLeft, y.loop.top);
      ctx.bezierCurveTo(
        x.loopLeft,
        y.loop.top - LOOP_CURVE_BEZIER_OFFSET,
        x.loopRight,
        y.loop.top - LOOP_CURVE_BEZIER_OFFSET,
        x.loopRight,
        y.loop.top,
      );
      ctx.lineTo(x.loopRight, y.loopRight.top);
    });
  }

  private _measure() {
    const { loopLeftStops, loopRightStops, mainStops } = this.data.structure;

    const loopLeftYs = this._extractYLevels(
      loopLeftStops,
      LOOP_LEFT_STOPS_SECTION_CLASS,
    );
    const loopRightYs = this._extractYLevels(
      loopRightStops,
      LOOP_RIGHT_STOPS_SECTION_CLASS,
    );
    const mainYs = this._extractYLevels(mainStops, MAIN_STOPS_SECTION_CLASS);

    const topLoopLeftActualY = loopLeftYs[0];
    const topLoopRightActualY = loopRightYs[0];
    const bottomLoopLeftActualY = loopLeftYs[loopLeftYs.length - 1];
    const bottomLoopRightActualY = loopRightYs[loopRightYs.length - 1];

    const topLoopLeftY = itsOk(topLoopLeftActualY ?? topLoopRightActualY);
    const topLoopRightY = itsOk(topLoopRightActualY ?? topLoopLeftActualY);
    const bottomLoopLeftY = itsOk(
      bottomLoopLeftActualY ?? bottomLoopRightActualY,
    );
    const bottomLoopRightY = itsOk(
      bottomLoopRightActualY ?? bottomLoopLeftActualY,
    );

    return {
      x: {
        loopLeft: NOTCH_WIDTH / 2,
        loopRight: this.width - NOTCH_WIDTH / 2,
        main: this.width / 2,
      },
      y: {
        loopLeft: {
          all: loopLeftYs,
          top: topLoopLeftY,
          bottom: bottomLoopLeftY,
        },
        loopRight: {
          all: loopRightYs,
          top: topLoopRightY,
          bottom: bottomLoopRightY,
        },
        main: {
          all: mainYs,
          top: mainYs[0] ?? null,
          bottom: mainYs[mainYs.length - 1] ?? null,
        },
        loop: {
          top: Math.min(topLoopLeftY, topLoopRightY),
          bottom: Math.max(bottomLoopLeftY, bottomLoopRightY),
        },
      },
    };
  }
}

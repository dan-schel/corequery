import { itsOk } from "@dan-schel/js-utils";
import type { BranchMapDiagramStructure } from "@/web/components/map-diagram/branch/types";
import {
  BaseMapDiagramController,
  NOTCH_WIDTH,
} from "@/web/components/map-diagram/base/controller";
import {
  BRANCH_A_STOPS_CLASS,
  BRANCH_B_STOPS_CLASS,
  COMMON_STOPS_CLASS,
} from "@/web/components/map-diagram/branch";

const BRANCH_OFFSET = 10;
const BRANCH_CURVE_BEZIER_OFFSET = 15;

export class BranchMapDiagramController extends BaseMapDiagramController<BranchMapDiagramStructure> {
  protected override _onRenderStructure() {
    const { commonStops, branchAStops, branchBStops } = this.data.structure;
    const { x, y } = this._measure();

    this._renderSection({
      stops: commonStops,
      x: x.common,
      yLevels: y.common.all,
      terminatesAtTop: true,
      terminatesAtBottom: false,
      notchSide: "right",
    });

    this._renderSection({
      stops: branchAStops,
      x: x.branchA,
      yLevels: y.branchA.all,
      terminatesAtTop: false,
      terminatesAtBottom: true,
      notchSide: "left",
    });

    this._renderSection({
      stops: branchBStops,
      x: x.branchB,
      yLevels: y.branchB.all,
      terminatesAtTop: false,
      terminatesAtBottom: true,
      notchSide: "right",
    });

    this._drawLine((ctx) => {
      // From the bottom of common to the top of branch A.
      ctx.moveTo(x.common, y.common.bottom);
      ctx.lineTo(x.common, y.common.bottom + BRANCH_OFFSET);
      ctx.bezierCurveTo(
        x.common,
        y.common.bottom + BRANCH_CURVE_BEZIER_OFFSET + BRANCH_OFFSET,
        x.branchA,
        y.branches.top - BRANCH_CURVE_BEZIER_OFFSET,
        x.branchA,
        y.branches.top,
      );
      ctx.lineTo(x.branchA, y.branchA.top);

      // From the bottom of common to the top of branch B.
      ctx.moveTo(x.common, y.common.bottom + BRANCH_OFFSET);
      ctx.bezierCurveTo(
        x.common,
        y.common.bottom + BRANCH_CURVE_BEZIER_OFFSET + BRANCH_OFFSET,
        x.branchB,
        y.branches.top - BRANCH_CURVE_BEZIER_OFFSET,
        x.branchB,
        y.branches.top,
      );
      ctx.lineTo(x.branchB, y.branchA.top);
    });
  }

  private _measure() {
    const { commonStops, branchAStops, branchBStops } = this.data.structure;

    const commonYs = this._extractYLevels(commonStops, COMMON_STOPS_CLASS);
    const topCommonY = itsOk(commonYs[0]);
    const bottomCommonY = itsOk(commonYs[commonYs.length - 1]);

    const branchAYs = this._extractYLevels(branchAStops, BRANCH_A_STOPS_CLASS);
    const topBranchAY = itsOk(branchAYs[0]);
    const bottomBranchAY = itsOk(branchAYs[branchAYs.length - 1]);

    const branchBYs = this._extractYLevels(branchBStops, BRANCH_B_STOPS_CLASS);
    const topBranchBY = itsOk(branchBYs[0]);
    const bottomBranchBY = itsOk(branchBYs[branchBYs.length - 1]);

    return {
      x: {
        common: this.width / 2,
        branchA: NOTCH_WIDTH / 2,
        branchB: this.width - NOTCH_WIDTH / 2,
      },
      y: {
        common: {
          all: commonYs,
          top: topCommonY,
          bottom: bottomCommonY,
        },
        branchA: {
          all: branchAYs,
          top: topBranchAY,
          bottom: bottomBranchAY,
        },
        branchB: {
          all: branchBYs,
          top: topBranchBY,
          bottom: bottomBranchBY,
        },
        branches: {
          top: Math.min(topBranchAY, topBranchBY),
          bottom: Math.max(bottomBranchAY, bottomBranchBY),
        },
      },
    };
  }
}

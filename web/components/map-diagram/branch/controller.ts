import { itsOk } from "@dan-schel/js-utils";
import type { BranchMapDiagramStructure } from "@/web/components/map-diagram/branch/types";
import {
  BaseMapDiagramController,
  NOTCH_WIDTH,
} from "@/web/components/map-diagram/base/controller";
import {
  BRANCH_A_STOPS_SECTION_CLASS,
  BRANCH_B_STOPS_SECTION_CLASS,
  COMMON_STOPS_SECTION_CLASS,
} from "@/web/components/map-diagram/branch";

const BRANCH_OFFSET = 10;
const BRANCH_CURVE_BEZIER_OFFSET = 15;

export class BranchMapDiagramController extends BaseMapDiagramController<BranchMapDiagramStructure> {
  protected override _onRenderStructure(structure: BranchMapDiagramStructure) {
    const commonYLevels = this._extractYLevels(
      structure.commonStops,
      COMMON_STOPS_SECTION_CLASS,
    );
    const branchAYLevels = this._extractYLevels(
      structure.branchAStops,
      BRANCH_A_STOPS_SECTION_CLASS,
    );
    const branchBYLevels = this._extractYLevels(
      structure.branchBStops,
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

    this._drawLine((ctx) => {
      // From the bottom of common to the top of branch A.
      ctx.moveTo(commonX, commonBottomY);
      ctx.lineTo(commonX, commonBottomY + BRANCH_OFFSET);
      ctx.bezierCurveTo(
        commonX,
        commonBottomY + BRANCH_CURVE_BEZIER_OFFSET + BRANCH_OFFSET,
        branchAX,
        branchCommomTopY - BRANCH_CURVE_BEZIER_OFFSET,
        branchAX,
        branchCommomTopY,
      );
      ctx.lineTo(branchAX, branchATopY);

      // From the bottom of common to the top of branch B.
      ctx.moveTo(commonX, commonBottomY + BRANCH_OFFSET);
      ctx.bezierCurveTo(
        commonX,
        commonBottomY + BRANCH_CURVE_BEZIER_OFFSET + BRANCH_OFFSET,
        branchBX,
        branchCommomTopY - BRANCH_CURVE_BEZIER_OFFSET,
        branchBX,
        branchCommomTopY,
      );
      ctx.lineTo(branchBX, branchBTopY);
    });
  }
}

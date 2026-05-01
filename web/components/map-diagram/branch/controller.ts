import { itsOk } from "@dan-schel/js-utils";
import type { BranchMapDiagramStructure } from "@/web/components/map-diagram/branch/types";
import { QuasilinearStopDiagramCanvasController } from "@/web/components/map-diagram/quasilinear-diagram-canvas-controller";
import {
  BRANCH_A_STOPS_SECTION_CLASS,
  BRANCH_B_STOPS_SECTION_CLASS,
  COMMON_STOPS_SECTION_CLASS,
} from "@/web/components/map-diagram/branch";

const BRANCH_CURVE_BEZIER_OFFSET = 15;

export class BranchMapDiagramController extends QuasilinearStopDiagramCanvasController<BranchMapDiagramStructure> {
  protected override onRenderStructure(structure: BranchMapDiagramStructure) {
    const commonYLevels = this.extractYLevels(
      structure.commonStops,
      COMMON_STOPS_SECTION_CLASS,
    );
    const branchAYLevels = this.extractYLevels(
      structure.branchAStops,
      BRANCH_A_STOPS_SECTION_CLASS,
    );
    const branchBYLevels = this.extractYLevels(
      structure.branchBStops,
      BRANCH_B_STOPS_SECTION_CLASS,
    );

    const commonX = this.width / 2;
    const branchAX = this.notchWidth / 2;
    const branchBX = this.width - this.notchWidth / 2;

    this.renderSection({
      stops: structure.commonStops,
      x: commonX,
      yLevels: commonYLevels,
      terminatesAtTop: true,
      terminatesAtBottom: false,
      notchSide: "right",
    });
    this.renderSection({
      stops: structure.branchAStops,
      x: branchAX,
      yLevels: branchAYLevels,
      terminatesAtTop: false,
      terminatesAtBottom: true,
      notchSide: "left",
    });
    this.renderSection({
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

    this.ctx.lineWidth = this.lineWidth;
    this.ctx.beginPath();

    // From the bottom of common to the top of branch A.
    this.ctx.moveTo(commonX, commonBottomY);
    this.ctx.lineTo(commonX, commonBottomY + this.branchOffset);
    this.ctx.bezierCurveTo(
      commonX,
      commonBottomY + BRANCH_CURVE_BEZIER_OFFSET + this.branchOffset,
      branchAX,
      branchCommomTopY - BRANCH_CURVE_BEZIER_OFFSET,
      branchAX,
      branchCommomTopY,
    );
    this.ctx.lineTo(branchAX, branchATopY);

    // From the bottom of common to the top of branch B.
    this.ctx.moveTo(commonX, commonBottomY + this.branchOffset);
    this.ctx.bezierCurveTo(
      commonX,
      commonBottomY + BRANCH_CURVE_BEZIER_OFFSET + this.branchOffset,
      branchBX,
      branchCommomTopY - BRANCH_CURVE_BEZIER_OFFSET,
      branchBX,
      branchCommomTopY,
    );
    this.ctx.lineTo(branchBX, branchBTopY);

    this.ctx.stroke();
  }
}

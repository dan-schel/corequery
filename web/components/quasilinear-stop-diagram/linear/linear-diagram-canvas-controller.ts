import type { LinearStopDiagramStructure } from "@/web/components/quasilinear-stop-diagram/structure-types";
import { QuasilinearStopDiagramCanvasController } from "@/web/components/quasilinear-stop-diagram/quasilinear-diagram-canvas-controller";
import { STOPS_SECTION_CLASS } from "@/web/components/quasilinear-stop-diagram/linear/LinearLayout";

export class LinearDiagramCanvasController extends QuasilinearStopDiagramCanvasController<LinearStopDiagramStructure> {
  protected override onRenderStructure(
    structure: LinearStopDiagramStructure,
    contentParent: HTMLDivElement,
  ) {
    this.renderSection({
      stops: structure.stops,
      x: this.width / 2,
      yLevels: this.extractYLevels(
        structure.stops,
        contentParent,
        STOPS_SECTION_CLASS,
      ),
      terminatesAtTop: true,
      terminatesAtBottom: true,
      notchSide: "right",
    });
  }
}

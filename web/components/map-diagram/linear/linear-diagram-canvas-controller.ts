import type { LinearStopDiagramStructure } from "@/web/components/map-diagram/structure-types";
import { QuasilinearStopDiagramCanvasController } from "@/web/components/map-diagram/quasilinear-diagram-canvas-controller";
import { STOPS_SECTION_CLASS } from "@/web/components/map-diagram/linear/LinearLayout";

export class LinearDiagramCanvasController extends QuasilinearStopDiagramCanvasController<LinearStopDiagramStructure> {
  protected override onRenderStructure(structure: LinearStopDiagramStructure) {
    this.renderSection({
      stops: structure.stops,
      x: this.width / 2,
      yLevels: this.extractYLevels(structure.stops, STOPS_SECTION_CLASS),
      terminatesAtTop: true,
      terminatesAtBottom: true,
      notchSide: "right",
    });
  }
}

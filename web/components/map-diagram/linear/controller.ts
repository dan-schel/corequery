import type { LinearMapDiagramStructure } from "@/web/components/map-diagram/linear/types";
import { QuasilinearStopDiagramCanvasController } from "@/web/components/map-diagram/quasilinear-diagram-canvas-controller";
import { STOPS_SECTION_CLASS } from "@/web/components/map-diagram/linear";

export class LinearMapDiagramController extends QuasilinearStopDiagramCanvasController<LinearMapDiagramStructure> {
  protected override onRenderStructure(structure: LinearMapDiagramStructure) {
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

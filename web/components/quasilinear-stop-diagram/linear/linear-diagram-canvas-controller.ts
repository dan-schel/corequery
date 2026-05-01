import type { LinearStopDiagramStructure } from "@/web/components/quasilinear-stop-diagram/structure-types";
import { QuasilinearStopDiagramCanvasController } from "@/web/components/quasilinear-stop-diagram/quasilinear-diagram-canvas-controller";

export class LinearDiagramCanvasController extends QuasilinearStopDiagramCanvasController<LinearStopDiagramStructure> {
  protected override onRenderStructure(
    structure: LinearStopDiagramStructure,
    contentParent: HTMLDivElement,
  ) {
    this.renderSection({
      stops: structure.stops,
      x: this.width / 2,
      yLevels: this.extractYLevels(structure.stops, contentParent),
      terminatesAtTop: true,
      terminatesAtBottom: true,
      notchSide: "right",
    });
  }
}

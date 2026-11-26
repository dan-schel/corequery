import type { LinearMapDiagramStructure } from "@/web/components/map-diagram/linear/types";
import { BaseMapDiagramController } from "@/web/components/map-diagram/base/controller";
import { STOPS_SECTION_CLASS } from "@/web/components/map-diagram/linear";
import { itsOk } from "@dan-schel/js-utils";

const CONTINUING_DASHES_LENGTHS = [2, 3, 4];
const CONTINUING_DASHES_GAPS = 4;

export class LinearMapDiagramController extends BaseMapDiagramController<LinearMapDiagramStructure> {
  protected override _onRenderStructure() {
    const structure = this.data.structure;

    const x = this.width / 2;
    const yLevels = this._extractYLevels(structure.stops, STOPS_SECTION_CLASS);

    this._renderSection({
      stops: structure.stops,
      x: x,
      yLevels,
      terminatesAtTop: structure.continuingAboveContent == null,
      terminatesAtBottom: structure.continuingBelowContent == null,
      notchSide: "right",
    });

    const dashesHeight =
      CONTINUING_DASHES_GAPS * CONTINUING_DASHES_LENGTHS.length +
      CONTINUING_DASHES_LENGTHS.reduce((a, b) => a + b, 0);

    if (structure.continuingAboveContent != null) {
      // renderSection would crash if there were no stops, and extractYLevels
      // would crash if the yLevels array was a different length to the number
      // of stops.
      const topY = itsOk(yLevels[0]);

      this._drawLine((ctx) => {
        ctx.moveTo(x, dashesHeight);
        ctx.lineTo(x, topY);
      });

      let y = 0;
      for (const length of CONTINUING_DASHES_LENGTHS) {
        this._drawLine((ctx) => {
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + length);
        });
        y += length + CONTINUING_DASHES_GAPS;
      }
    }

    if (structure.continuingBelowContent != null) {
      const bottomY = itsOk(yLevels[yLevels.length - 1]);

      this._drawLine((ctx) => {
        ctx.moveTo(x, bottomY);
        ctx.lineTo(x, this.height - dashesHeight);
      });

      let y = this.height;
      for (const length of CONTINUING_DASHES_LENGTHS) {
        this._drawLine((ctx) => {
          ctx.moveTo(x, y - length);
          ctx.lineTo(x, y);
        });
        y -= length + CONTINUING_DASHES_GAPS;
      }
    }
  }
}

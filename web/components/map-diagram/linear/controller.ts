import type { LinearMapDiagramStructure } from "@/web/components/map-diagram/linear/types";
import {
  BaseMapDiagramController,
  LINE_WIDTH,
} from "@/web/components/map-diagram/base/controller";
import { STOPS_SECTION_CLASS } from "@/web/components/map-diagram/linear";
import { itsOk } from "@dan-schel/js-utils";

const CONTINUING_BUBBLES_OFFSETS = 10;
const CONTINUING_BUBBLES_RADIUS = LINE_WIDTH / 2;
const CONTINUING_BUBBLES_COUNT = 4;

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

    const bubblesHeight =
      CONTINUING_BUBBLES_OFFSETS * (CONTINUING_BUBBLES_COUNT - 1) +
      CONTINUING_BUBBLES_RADIUS;

    if (structure.continuingAboveContent != null) {
      // renderSection would crash if there were no stops, and extractYLevels
      // would crash if the yLevels array was a different length to the number
      // of stops.
      const topY = itsOk(yLevels[0]);

      this._drawLine((ctx) => {
        ctx.moveTo(x, bubblesHeight);
        ctx.lineTo(x, topY);
      });

      for (let i = 0; i < CONTINUING_BUBBLES_COUNT; i++) {
        this._drawCircle(
          x,
          bubblesHeight - i * CONTINUING_BUBBLES_OFFSETS,
          CONTINUING_BUBBLES_RADIUS,
        );
      }
    }

    if (structure.continuingBelowContent != null) {
      const bottomY = itsOk(yLevels[yLevels.length - 1]);

      this._drawLine((ctx) => {
        ctx.moveTo(x, bottomY);
        ctx.lineTo(x, this.height - bubblesHeight);
      });

      for (let i = 0; i < CONTINUING_BUBBLES_COUNT; i++) {
        this._drawCircle(
          x,
          this.height - bubblesHeight + i * CONTINUING_BUBBLES_OFFSETS,
          CONTINUING_BUBBLES_RADIUS,
        );
      }
    }
  }
}

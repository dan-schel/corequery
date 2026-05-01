import { assertNever } from "@dan-schel/js-utils";
import type { FoundationalData } from "@/web/data/foundational-data";
import { LinkText } from "@/web/components/core/LinkText";
import { TextBlock } from "@/web/components/core/TextBlock";
import type { lineDiagramStopFodaSchema } from "@/shared/apis/foundational-data/v1/foundational-data";
import type z from "zod";

export function buildStopStructures(
  foda: FoundationalData,
  stops: readonly z.infer<typeof lineDiagramStopFodaSchema>[],
) {
  return stops.map((stop) => {
    const stopData = foda.stops.require(stop.stopId);

    // TODO: Standardize this with usePageSearch.
    const url = `/stop/${stopData.urlPath}`;

    if (stop.type === "regular") {
      return {
        content: (
          <TextBlock style="strong">
            <LinkText href={url} style="subtle">
              {stopData.name}
            </LinkText>
          </TextBlock>
        ),
      };
    } else if (stop.type === "always-express") {
      return {
        content: (
          <TextBlock style="small-weak">
            <LinkText href={url} style="subtle">
              Skips {stopData.name}
            </LinkText>
          </TextBlock>
        ),
        drawMark: false,
      };
    } else {
      assertNever(stop.type);
    }
  });
}

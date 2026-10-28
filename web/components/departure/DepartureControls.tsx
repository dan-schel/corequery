import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import { HoverSquareButtonHousing } from "@/web/components/button/housings/HoverSquareButtonHousing";
import { MingcuteDownLine } from "@/web/components/icons/MingcuteDownLine";
import { Row } from "@/web/components/core/Row";
import { TextBlock } from "@/web/components/core/TextBlock";
import { VerticalBleed } from "@/web/components/core/VerticalBleed";
import { getTextBoxHeightRem } from "@/web/components/core/TextBoxTrim";
import { MingcuteTimeLine } from "@/web/components/icons/MingcuteTimeLine";
import { MingcuteFilterLine } from "@/web/components/icons/MingcuteFilterLine";

type DepartureControlsProps = {
  class?: string;
};

export function DepartureControls(props: DepartureControlsProps) {
  return (
    <Grid class="desktop:pt-6 desktop:px-4">
      <Grid
        class={clsx(
          props.class,
          "grid-cols-[1fr_1fr] desktop:max-w-150 bg-bg-raised divide-x divide-soft-border desktop:border not-desktop:border-b border-soft-border desktop:rounded-lg overflow-hidden",
        )}
      >
        <HoverSquareButtonHousing>
          <Row xAlign="space-between" yAlign="center" class="p-4">
            <Row yAlign="center" class="gap-2">
              <VerticalBleed heightRem={getTextBoxHeightRem("text-md")}>
                <MingcuteTimeLine class="text-icon-lg text-fg" />
              </VerticalBleed>
              <TextBlock>Now</TextBlock>
            </Row>
            <VerticalBleed heightRem={getTextBoxHeightRem("text-md")}>
              <MingcuteDownLine class="text-icon-lg text-fg" />
            </VerticalBleed>
          </Row>
        </HoverSquareButtonHousing>
        <HoverSquareButtonHousing>
          <Row xAlign="space-between" yAlign="center" class="p-4">
            <Row yAlign="center" class="gap-2">
              <VerticalBleed heightRem={getTextBoxHeightRem("text-md")}>
                <MingcuteFilterLine class="text-icon-lg text-fg" />
              </VerticalBleed>
              <TextBlock>All trains</TextBlock>
            </Row>
            <VerticalBleed heightRem={getTextBoxHeightRem("text-md")}>
              <MingcuteDownLine class="text-icon-lg text-fg" />
            </VerticalBleed>
          </Row>
        </HoverSquareButtonHousing>
      </Grid>
    </Grid>
  );
}

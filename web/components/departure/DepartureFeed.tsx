import clsx from "clsx";
import { Column } from "@/web/components/core/Column";
import type { DepartureFeedData } from "@/web/components/departure/types";
import { DepartureList } from "@/web/components/departure/DepartureList";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Row } from "@/web/components/core/Row";
import { Button } from "@/web/components/button/Button";
import { MajesticonsPinLine } from "@/web/components/icons/MajesticonsPinLine";
import { MingcuteFullscreen2Line } from "@/web/components/icons/MingcuteFullscreen2Line";

type DepartureFeedProps = {
  class?: string;
  feed: DepartureFeedData;
};

export function DepartureFeed(props: DepartureFeedProps) {
  return (
    <Column class={clsx(props.class, "min-w-0")}>
      <Row
        xAlign="space-between"
        yAlign="center"
        class="gap-2 not-desktop:pl-4 not-desktop:pr-2 not-desktop:pt-6 pb-2"
      >
        <TextBlock style="subtitle" class="shrink min-w-0" oneLine>
          {props.feed.title}
        </TextBlock>
        <Row>
          <Button theme="hover" icon={MajesticonsPinLine} />
          <Button theme="hover" icon={MingcuteFullscreen2Line} />
        </Row>
      </Row>
      <DepartureList
        class="bg-bg-raised desktop:border desktop:border-soft-border desktop:rounded-lg overflow-hidden not-desktop:border-t not-desktop:border-soft-border"
        departures={props.feed.departures}
        loading={props.feed.loading}
        isError={props.feed.isError}
      />
    </Column>
  );
}

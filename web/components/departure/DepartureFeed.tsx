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
          {props.feed.query.title}
        </TextBlock>
        <Row class="gap-2">
          <Button theme="hover" icon={MajesticonsPinLine} />
          <Button theme="hover" icon={MingcuteFullscreen2Line} />
        </Row>
      </Row>
      <DepartureList
        // Since departure lists set a min height for their loading/error
        // states, `box-content` is needed to ensure borders add additional
        // height to that minimum, rather than being included in it when there's
        // no content and causing a tiny layout shift once the content loads.
        //
        // Luckily, Tailwind resets this for all elements, so it only applies to
        // this container, not any of its children.
        class="bg-bg-raised desktop:border not-desktop:border-y border-soft-border desktop:rounded-lg overflow-hidden box-content"

        departures={props.feed.departures}
        queryCount={props.feed.query.count}
        loading={props.feed.loading}
        isError={props.feed.isError}
      />
    </Column>
  );
}

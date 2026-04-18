import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/use-simple-headers";
import { useRoute } from "preact-iso";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { NotFoundPage } from "@/web/components/NotFoundPage";
import { listifyAnd } from "@dan-schel/js-utils";
import { useMemo } from "preact/hooks";
import type { FodaStop } from "@/web/data/foundational-data/foda-stop-collection";

export default function Stop() {
  const {
    params: { id: stopUrlPath },
  } = useRoute();

  const { foda } = useFoundationalData();

  const stop = useMemo(
    () => foda.stops.getByUrlPath(stopUrlPath ?? ""),
    [foda.stops, stopUrlPath],
  );

  if (stop === null)
    return <NotFoundPage afterConfirming="foundational-data-version" />;

  return <StopPageContent stop={stop} />;
}

type StopPageContentProps = {
  stop: FodaStop;
};

function StopPageContent(props: StopPageContentProps) {
  const { foda } = useFoundationalData();

  return (
    <Page {...useSimpleHeaders({ title: props.stop.name })}>
      <Column class="px-4 py-8 gap-8">
        <TextBlock>
          {
            // TODO: This is obviously horrible and temporary! The formatting
            // needs to respect the terminology.
            listifyAnd(
              props.stop.canonicalLinesServingStop
                .map((x) => foda.lines.require(x).name)
                .sort((a, b) => a.localeCompare(b)),
            )
          }{" "}
          {props.stop.canonicalLinesServingStop.length === 1 ? "Line" : "lines"}
        </TextBlock>
      </Column>
    </Page>
  );
}

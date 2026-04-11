import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/use-simple-headers";
import { useRoute } from "preact-iso";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import NotFound from "@/web/pages/NotFound";
import type { fodaSchema } from "@/shared/apis/foundational-data/v1/foundational-data";
import type z from "zod";

export default function Stop() {
  const {
    params: { id: stopUrlPath },
  } = useRoute();

  const { foda } = useFoundationalData();
  const stop = foda.stops.find((x) => x.urlPath === stopUrlPath) ?? null;

  // TODO: This actually isn't good enough. The NotFound page will check that
  // the PWA is not outdated, but won't check that the foundational data is up
  // to date.
  if (stop === null) return <NotFound />;

  return <StopPageContent stop={stop} />;
}

type StopPageContentProps = {
  stop: z.infer<typeof fodaSchema>["stops"][number];
};

function StopPageContent(props: StopPageContentProps) {
  return (
    <Page {...useSimpleHeaders({ title: props.stop.name })}>
      <Column class="px-4 py-8 gap-8">
        <TextBlock>{props.stop.name} station</TextBlock>
      </Column>
    </Page>
  );
}

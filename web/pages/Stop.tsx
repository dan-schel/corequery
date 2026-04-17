import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/use-simple-headers";
import { useRoute } from "preact-iso";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { NotFoundPage } from "@/web/components/NotFoundPage";
import type { fodaSchema } from "@/shared/apis/foundational-data/v1/foundational-data";
import type z from "zod";
import { useTerminology } from "@/web/hooks/use-terminology";

export default function Stop() {
  const {
    params: { id: stopUrlPath },
  } = useRoute();

  const { foda } = useFoundationalData();
  const stop = foda.stops.find((x) => x.urlPath === stopUrlPath) ?? null;

  if (stop === null)
    return <NotFoundPage afterConfirming="foundational-data-version" />;

  return <StopPageContent stop={stop} />;
}

type StopPageContentProps = {
  stop: z.infer<typeof fodaSchema>["stops"][number];
};

function StopPageContent(props: StopPageContentProps) {
  const { formatStop } = useTerminology();

  return (
    <Page {...useSimpleHeaders({ title: props.stop.name })}>
      <Column class="px-4 py-8 gap-8">
        <TextBlock>{formatStop(props.stop.name)}</TextBlock>
      </Column>
    </Page>
  );
}

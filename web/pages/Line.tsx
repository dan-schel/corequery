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

export default function Line() {
  const {
    params: { id: lineUrlPath },
  } = useRoute();

  const { foda } = useFoundationalData();
  const line = foda.lines.find((x) => x.urlPath === lineUrlPath) ?? null;

  if (line === null)
    return <NotFoundPage afterConfirming="foundational-data-version" />;

  return <LinePageContent line={line} />;
}

type LinePageContentProps = {
  line: z.infer<typeof fodaSchema>["lines"][number];
};

function LinePageContent(props: LinePageContentProps) {
  const { formatLine } = useTerminology();

  return (
    <Page {...useSimpleHeaders({ title: formatLine(props.line.name) })}>
      <Column class="px-4 py-8 gap-8">
        <TextBlock>{formatLine(props.line.name)}</TextBlock>
      </Column>
    </Page>
  );
}

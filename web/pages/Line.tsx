import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/use-simple-headers";
import { useRoute } from "preact-iso";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { NotFoundPage } from "@/web/components/NotFoundPage";
import { useTerminology } from "@/web/hooks/use-terminology";
import { LineDiagramSection } from "@/web/components/pages/line/LineDiagramSection";
import { useMemo } from "preact/hooks";
import type { FodaLine } from "@/web/data/foundational-data/foda-line-collection";

export default function Line() {
  const {
    params: { id: lineUrlPath },
  } = useRoute();

  const { foda } = useFoundationalData();

  const line = useMemo(
    () => foda.lines.getByUrlPath(lineUrlPath ?? ""),
    [foda.lines, lineUrlPath],
  );

  if (line === null)
    return <NotFoundPage afterConfirming="foundational-data-version" />;

  return <LinePageContent line={line} />;
}

type LinePageContentProps = {
  line: FodaLine;
};

function LinePageContent(props: LinePageContentProps) {
  const { formatLine } = useTerminology();

  return (
    <Page {...useSimpleHeaders({ title: formatLine(props.line.name) })}>
      <Column class="px-4 py-8 gap-8">
        {props.line.diagram.entries.length > 0 && (
          <LineDiagramSection diagram={props.line.diagram} />
        )}
      </Column>
    </Page>
  );
}

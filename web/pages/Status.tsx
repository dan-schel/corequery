import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/use-simple-headers";

export default function Status() {
  return (
    <Page {...useSimpleHeaders({ title: "Status" })}>
      <Column class="px-4 py-8 gap-8">
        <TextBlock>LGTM</TextBlock>
      </Column>
    </Page>
  );
}

import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/use-simple-headers";

export default function Nearby() {
  return (
    <Page {...useSimpleHeaders({ title: "Nearby" })}>
      <Column class="px-4 py-8 gap-8">
        <TextBlock>Idk</TextBlock>
      </Column>
    </Page>
  );
}

import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/use-simple-headers";

export default function AdminControls() {
  return (
    <Page {...useSimpleHeaders({ title: "Admin controls" })}>
      <Column class="px-4 py-8 gap-8">
        <TextBlock>
          Maybe the real admin controls were the friends we made along the way?
        </TextBlock>
      </Column>
    </Page>
  );
}

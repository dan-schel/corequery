import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/use-simple-headers";
import { Strong } from "@/web/components/core/Strong";

export default function ZenMode() {
  return (
    <Page {...useSimpleHeaders({ title: "Zen mode" })}>
      <Column class="px-4 py-8 gap-8">
        <TextBlock>
          <Strong>✨</Strong> Zen! <Strong>✨</Strong>
        </TextBlock>
      </Column>
    </Page>
  );
}

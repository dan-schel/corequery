import { PwaStatus } from "@/web/components/PwaStatus";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/use-simple-headers";
import { useStaticData } from "@/web/utils/use-static-data";
import { useFoundationalData } from "@/web/utils/use-foundational-data";

export default function Home() {
  const { appName } = useStaticData();
  const foda = useFoundationalData();

  return (
    <Page {...useSimpleHeaders({ title: "Home" })}>
      <Column class="px-4 py-8 gap-8">
        <TextBlock style="title">{appName}</TextBlock>
        <TextBlock>
          Foundational data hash: {foda.hash.slice(0, 8)}...
        </TextBlock>
        <PwaStatus />
      </Column>
    </Page>
  );
}

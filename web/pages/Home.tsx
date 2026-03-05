import { PwaStatus } from "@/web/components/PwaStatus";
import { useStaticData } from "@/web/data/static-data";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { useFoundationalData } from "@/web/data/foundational-data/context";
import { Page } from "@/web/components/page/Page";
import { SimpleMobileHeader } from "@/web/components/page/SimpleMobileHeader";

export default function Home() {
  const { appName } = useStaticData();
  const foda = useFoundationalData();

  return (
    <Page mobileHeaderContent={<SimpleMobileHeader title="Home" />}>
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

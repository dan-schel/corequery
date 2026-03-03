import { Nav } from "@/web/components/Nav";
import { PwaStatus } from "@/web/components/PwaStatus";
import { useStaticData } from "@/web/data/static-data";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { useFoundationalData } from "@/web/data/foundational-data/context";

export default function Home() {
  const { appName } = useStaticData();
  const foda = useFoundationalData();

  return (
    <Column class="px-4 py-8 gap-8">
      <Column class="gap-4">
        <TextBlock style="title" oneLine>
          {appName} - Home
        </TextBlock>
        <Nav />
      </Column>
      <TextBlock>Foundational data hash: {foda.hash}</TextBlock>
      <PwaStatus />
    </Column>
  );
}

import { useEffect } from "preact/hooks";
import { Nav } from "@/web/components/Nav";
import { runSharedCode } from "@/shared/example";
import { PwaStatus } from "@/web/components/PwaStatus";
import { useStaticData } from "@/web/data/static-data";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";

export default function Home() {
  const { appName } = useStaticData();

  useEffect(() => {
    runSharedCode();
  }, []);

  return (
    <Column class="px-4 py-8 gap-8">
      <Column class="gap-4">
        <TextBlock style="title" oneLine>
          {appName} - Home
        </TextBlock>
        <Nav />
      </Column>
      <PwaStatus />
    </Column>
  );
}

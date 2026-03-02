import { useEffect } from "preact/hooks";
import { Nav } from "@/web/components/Nav";
import { runSharedCode } from "@/shared/example";
import { PwaStatus } from "@/web/components/PwaStatus";
import { useStaticData } from "@/web/data/static-data";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { useQuery } from "@/web/utils/api";
import { FOUNDATIONAL_DATA_V1 } from "@/shared/apis";

export default function Home() {
  const { appName } = useStaticData();

  const { data } = useQuery(FOUNDATIONAL_DATA_V1, {});

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
      <TextBlock as="pre">{JSON.stringify(data, null, 2)}</TextBlock>
      <PwaStatus />
    </Column>
  );
}

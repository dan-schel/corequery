import { Column } from "@/web/components/core/Column";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Nav } from "@/web/components/Nav";
import { useStaticData } from "@/web/data/static-data";

export default function NotFound() {
  const { appName } = useStaticData();

  return (
    <Column class="px-4 py-8 gap-8">
      <Column class="gap-4">
        <TextBlock style="title" oneLine>
          {appName} - Not Found
        </TextBlock>
        <Nav />
      </Column>
      <TextBlock>This page was not found.</TextBlock>
    </Column>
  );
}

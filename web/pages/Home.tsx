import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/use-simple-headers";
import { useStaticData } from "@/web/hooks/use-static-data";

export default function Home() {
  const { appName } = useStaticData();

  return (
    <Page {...useSimpleHeaders({ title: "Home" })}>
      <Column class="px-4 py-8 gap-8">
        <TextBlock style="title">{appName}</TextBlock>
      </Column>
    </Page>
  );
}

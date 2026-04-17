import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/use-simple-headers";
import { Markdown } from "@/web/components/markdown/Markdown";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";

export default function Home() {
  const { foda } = useFoundationalData();

  return (
    <Page {...useSimpleHeaders({ title: "Home" })}>
      <Column class="px-4 py-8 gap-12">
        <Markdown markdown={foda.landingPage.primaryMarkdown} />
      </Column>
    </Page>
  );
}

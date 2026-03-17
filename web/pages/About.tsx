import { Column } from "@/web/components/core/Column";
import { TextPlaceholder } from "@/web/components/core/Placeholder";
import { TextBlock } from "@/web/components/core/TextBlock";
import { InlineMarkdown } from "@/web/components/markdown/InlineMarkdown";
import { Markdown } from "@/web/components/markdown/Markdown";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/use-simple-headers";
import { useQuery } from "@/web/hooks/use-query";
import { ABOUT_PAGE_V1 } from "@/shared/apis";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { Divider } from "@/web/components/core/Divider";
import { Alert } from "@/web/components/Alert";

export default function About() {
  const { foda } = useFoundationalData();
  const { data, loading, error } = useQuery(ABOUT_PAGE_V1, {});

  const headers = useSimpleHeaders({ title: "About" });

  if (loading) {
    return (
      <Page {...headers}>
        <Column class="px-4 py-8 gap-6">
          <TextPlaceholder class="w-[40%] text-xl" />
          <TextPlaceholder class="w-full text-md" />
          <TextPlaceholder class="w-full text-md" />
          <TextPlaceholder class="w-[25%] text-lg" />
          <TextPlaceholder class="w-full text-md" />
          <TextPlaceholder class="w-[70%] text-md" />
        </Column>
      </Page>
    );
  }

  if (error != null || data == null) {
    return (
      <Page {...headers}>
        <Column class="px-4 py-8 gap-6">
          <Alert type="error">
            <TextBlock>Unable to load the about page.</TextBlock>
          </Alert>
        </Column>
      </Page>
    );
  }

  return (
    <Page {...headers}>
      <Column class="px-4 py-8 gap-12">
        <Markdown markdown={data.primaryMarkdown} />
        <Column class="gap-8">
          <Divider />
          <InlineMarkdown
            class="text-sm text-soft-text"
            markdown={foda.footerPrimaryMarkdown}
          />
        </Column>
      </Column>
    </Page>
  );
}

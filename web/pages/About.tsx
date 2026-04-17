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
import { useStaticData } from "@/web/hooks/use-static-data";

export default function About() {
  const { appName } = useStaticData();
  const { foda } = useFoundationalData();
  const { data, loading, error } = useQuery(ABOUT_PAGE_V1, {});

  const headers = useSimpleHeaders({ title: `About ${appName}` });

  if (loading) {
    return (
      <Page {...headers}>
        <Column class="px-4 py-8">
          <TextPlaceholder class="w-[30%] text-xl" />
          <div class="h-8" />
          <TextPlaceholder class="w-full text-md" />
          <div class="h-3" />
          <TextPlaceholder class="w-full text-md" />
          <div class="h-3" />
          <TextPlaceholder class="w-[60%] text-md" />
          <div class="h-12" />
          <TextPlaceholder class="w-[40%] text-lg" />
          <div class="h-8" />
          <TextPlaceholder class="w-full text-md" />
          <div class="h-3" />
          <TextPlaceholder class="w-full text-md" />
          <div class="h-3" />
          <TextPlaceholder class="w-[20%] text-md" />
          <div class="h-12" />
          <TextPlaceholder class="w-[50%] text-lg" />
          <div class="h-8" />
          <TextPlaceholder class="w-full text-md" />
          <div class="h-3" />
          <TextPlaceholder class="w-[80%] text-md" />
        </Column>
      </Page>
    );
  }

  if (error != null || data == null) {
    return (
      <Page {...headers}>
        <Column class="px-4 py-8">
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
          <TextBlock as="p" style="small-weak">
            <InlineMarkdown markdown={foda.footerPrimaryMarkdown} />
          </TextBlock>
        </Column>
      </Column>
    </Page>
  );
}

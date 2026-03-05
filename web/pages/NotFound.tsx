import { Column } from "@/web/components/core/Column";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Page } from "@/web/components/page/Page";
import { Button } from "@/web/components/button/Button";
import { MingcuteHome4Line } from "@/web/components/icons/MingcuteHome4Line";

export default function NotFound() {
  return (
    <Page mobileHeaderContent={null}>
      <Column class="px-4 py-8 gap-8">
        <TextBlock style="title">Not Found</TextBlock>
        <TextBlock>This page was not found.</TextBlock>
        <Button
          class="self-start"
          href="/"
          text="Go home"
          icon={MingcuteHome4Line}
        />
      </Column>
    </Page>
  );
}

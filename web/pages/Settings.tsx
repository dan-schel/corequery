import { Column } from "@/web/components/core/Column";
import { TextBlock } from "@/web/components/core/TextBlock";
import { ThemePicker } from "@/web/components/pages/settings/ThemePicker";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/use-simple-headers";
import { Divider } from "@/web/components/core/Divider";

export default function Settings() {
  return (
    <Page {...useSimpleHeaders({ title: "Settings" })}>
      <Column class="px-4 py-8 gap-8">
        <Column class="gap-6">
          <TextBlock style="strong">Theme</TextBlock>
          <TextBlock>
            "Auto" means the colour theme should follow your device's/browser's
            settings.
          </TextBlock>
          <ThemePicker class="self-start" />
        </Column>
        <Divider />
        <TextBlock style="small-weak">
          (Settings are saved to your device's/browser's local storage.)
        </TextBlock>
      </Column>
    </Page>
  );
}

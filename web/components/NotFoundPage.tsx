import { Column } from "@/web/components/core/Column";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Page } from "@/web/components/page/Page";
import { Button } from "@/web/components/button/Button";
import { MingcuteHome4Line } from "@/web/components/icons/MingcuteHome4Line";
import { LoadingSpinner } from "@/web/components/LoadingSpinner";
import { useVersionAssurance } from "@/web/hooks/use-version-assurance";

type NotFoundPageProps = {
  afterConfirming: "frontend-version" | "foundational-data-version";
};

export function NotFoundPage({ afterConfirming }: NotFoundPageProps) {
  const loading = useVersionAssurance(afterConfirming);

  if (loading) {
    return (
      <Page mobileHeader={null} desktopHeader={null}>
        <Column xAlign="center" yAlign="center">
          <LoadingSpinner />
        </Column>
      </Page>
    );
  }

  return (
    <Page mobileHeader={null} desktopHeader={null}>
      <Column class="px-4 py-8 gap-8" xAlign="center" yAlign="center">
        <TextBlock style="title" align="center">
          Page not found
        </TextBlock>
        <TextBlock align="center">
          This page doesn't exist, at least not anymore!
        </TextBlock>
        <Button href="/" text="Go home" icon={MingcuteHome4Line} />
      </Column>
    </Page>
  );
}

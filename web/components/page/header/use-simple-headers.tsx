import { TextBlock } from "@/web/components/core/TextBlock";
import { PageCenterer } from "@/web/components/page/PageCenterer";
import { SimpleMobileHeaderContent } from "@/web/components/page/header/SimpleMobileHeaderContent";
import { Column } from "@/web/components/core/Column";
import { MingcuteLeftLine } from "@/web/components/icons/MingcuteLeftLine";
import { Button } from "@/web/components/button/Button";
import clsx from "clsx";

type SimpleHeadersProps = {
  title: string;
  back?: {
    href: string;
    text: string;
  } | null;
};

export function useSimpleHeaders(props: SimpleHeadersProps) {
  return {
    mobileHeader: (
      <SimpleMobileHeaderContent
        title={props.title}
        backHref={props.back?.href ?? null}
      />
    ),
    desktopHeader: (
      <PageCenterer>
        <Column
          class={clsx("mx-4 py-4 gap-8 border-b border-soft-border", {
            "pt-8": props.back == null,
            "pt-6": props.back != null,
          })}
        >
          {props.back != null && (
            <Button
              text={props.back.text}
              href={props.back.href}
              icon={MingcuteLeftLine}
              class="self-start"
              layout="narrow-icon"
            />
          )}
          <TextBlock style="megatitle">{props.title}</TextBlock>
        </Column>
      </PageCenterer>
    ),
  };
}

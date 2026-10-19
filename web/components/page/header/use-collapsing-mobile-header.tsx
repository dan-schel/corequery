import { PageCenterer } from "@/web/components/page/PageCenterer";
import type { ComponentChildren } from "preact";
import { Grid } from "@/web/components/core/Grid";
import { SimpleMobileHeaderContent } from "@/web/components/page/header/SimpleMobileHeaderContent";
import { Column } from "@/web/components/core/Column";
import { Button } from "@/web/components/button/Button";
import { MingcuteLeftLine } from "@/web/components/icons/MingcuteLeftLine";
import { TextBlock } from "@/web/components/core/TextBlock";
import clsx from "clsx";

type CollapsingHeadersProps = {
  class?: string;
  title: string;
  back?: {
    href: string;
    text: string;
  } | null;
  additionalContent?: ComponentChildren;
};

export function useCollapsingHeaders(props: CollapsingHeadersProps) {
  return {
    hideMobileHeaderWhenScrolledToTop: true,
    mobileHeader: (
      <SimpleMobileHeaderContent
        title={props.title}
        backHref={props.back?.href ?? null}
      />
    ),
    agnosticHeader: (
      <Grid class="not-desktop:bg-bg-navbar not-desktop:border-b not-desktop:border-soft-border">
        <PageCenterer>
          <Grid class="not-desktop:px-4 desktop:mx-4 desktop:border-b desktop:border-soft-border">
            <Column
              class={clsx("gap-8", {
                "pt-4 pb-6 desktop:pt-6": props.back != null,
                "py-6 desktop:pt-8": props.back == null,
                "desktop:pb-4": props.additionalContent == null,
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
              <Column class="gap-4">
                <TextBlock style="megatitle">{props.title}</TextBlock>
                {props.additionalContent}
              </Column>
            </Column>
          </Grid>
        </PageCenterer>
      </Grid>
    ),
  };
}

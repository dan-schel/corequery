import { TextBlock } from "@/web/components/core/TextBlock";
import { TextPlaceholder } from "@/web/components/core/Placeholder";
import { Grid } from "@/web/components/core/Grid";

type AsyncFieldValueProps = {
  class?: string;
  prefix: string;
  value: string | null;
  loading: boolean;
};

export function AsyncFieldValue(props: AsyncFieldValueProps) {
  if (props.loading) {
    return (
      <Grid class={props.class}>
        <TextPlaceholder class="w-[40%] text-md" />
      </Grid>
    );
  }

  if (props.value == null) return null;

  return (
    <TextBlock class={props.class}>
      {props.prefix}: {props.value}
    </TextBlock>
  );
}

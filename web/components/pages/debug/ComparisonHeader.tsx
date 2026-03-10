import {
  HeaderWithPill,
  type HeaderWithPillProps,
} from "@/web/components/pages/debug/HeaderWithPill";

type ComparisonHeaderProps = {
  class?: string;
  header: string;
  currentValue: string;
  latestValue: string | null;
  loading: boolean;
};

export function ComparisonHeader(props: ComparisonHeaderProps) {
  return (
    <HeaderWithPill
      class={props.class}
      header={props.header}
      pillContent={getPillContent(props.currentValue, props.latestValue)}
      loading={props.loading}
    />
  );
}

function getPillContent(
  currentValue: string,
  latestValue: string | null,
): HeaderWithPillProps["pillContent"] {
  if (latestValue == null) return null;

  return {
    text: currentValue === latestValue ? "Up to date" : "Outdated",
    type: currentValue === latestValue ? "success" : "error",
  };
}

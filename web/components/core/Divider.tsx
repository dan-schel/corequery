import clsx from "clsx";

type DividerProps = {
  class?: string;
};

export function Divider(props: DividerProps) {
  return <div class={clsx(props.class, "border-b border-soft-border")} />;
}

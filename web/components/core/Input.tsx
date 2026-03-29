import clsx from "clsx";

const styles = {
  regular: "text-fg text-md outline-none border-none placeholder:text-fg-weak",
};

type InputProps = {
  class?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: keyof typeof styles;
};

export function Input(props: InputProps) {
  const style = styles[props.style ?? "regular"];

  return (
    <input
      class={clsx(props.class, style)}
      value={props.value}
      onInput={(e) => {
        if (
          e.target == null ||
          !("value" in e.target) ||
          typeof e.target.value !== "string"
        ) {
          return;
        }

        props.onChange(e.target.value);
      }}
      placeholder={props.placeholder}
    />
  );
}

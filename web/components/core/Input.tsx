import clsx from "clsx";
import type { ComponentChildren, Ref } from "preact";

const styles = {
  regular: "text-fg text-md outline-none border-none placeholder:text-fg-weak",
};

type InputProps = {
  class?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  style?: keyof typeof styles;
  inputRef?: Ref<HTMLInputElement>;
  search?: boolean;
};

export function Input(props: InputProps) {
  const style = styles[props.style ?? "regular"];

  return (
    <SubmitDetector onSubmit={props.onSubmit}>
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
        ref={props.inputRef}
        autoComplete="off"
        type={(props.search ?? false) ? "search" : "text"}
      />
    </SubmitDetector>
  );
}

type SubmitDetectorProps = {
  children: ComponentChildren;
  onSubmit?: () => void;
};

function SubmitDetector(props: SubmitDetectorProps) {
  if (props.onSubmit == null) {
    return props.children;
  }

  return (
    <form
      class="grid"
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit?.();
      }}
    >
      {props.children}
    </form>
  );
}

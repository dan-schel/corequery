import clsx from "clsx";
import type { ComponentChildren, Ref, TargetedInputEvent } from "preact";

const styles = {
  regular: "text-fg text-md outline-none border-none placeholder:text-fg-weak",
  search:
    "text-fg-strong text-xl desktop:text-md font-bold outline-none border-none placeholder:text-fg-weak placeholder:font-normal",
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
  const inputProps = {
    class: clsx(props.class, style),
    value: props.value,
    onInput: (e: TargetedInputEvent<HTMLInputElement>) => {
      if (
        e.target == null ||
        !("value" in e.target) ||
        typeof e.target.value !== "string"
      ) {
        return;
      }

      props.onChange(e.target.value);
    },
    placeholder: props.placeholder,
    ref: props.inputRef,
    autoComplete: "off",
  };
  const input =
    (props.search ?? false) ? (
      <input {...inputProps} type="search" />
    ) : (
      <input {...inputProps} type="text" />
    );

  return <SubmitDetector onSubmit={props.onSubmit}>{input}</SubmitDetector>;
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

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

  return (
    <SubmitDetector onSubmit={props.onSubmit}>
      {
        // Preact doesn't like having `type` be dynamic, because of this
        // discriminated union:
        //
        // https://github.com/preactjs/preact/blob/630a87e468fc14eca5a5fd617288b4a606763d9d/src/dom.d.ts#L2189
        //
        // I don't set `list` or `role`, so `inputProps` can be identical in
        // both cases, but TypeScript doesn't realise.
        (props.search ?? false) ? (
          <input type="search" {...inputProps} />
        ) : (
          <input type="text" {...inputProps} />
        )
      }
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

import clsx from "clsx";
import { Clickable } from "@/web/components/core/Clickable";
import { Row } from "@/web/components/core/Row";
import { TextBlock } from "@/web/components/core/TextBlock";

export type PickerOption<T extends string> = {
  readonly value: T;
  readonly label: string;
};

type PickerProps<T extends string> = {
  class?: string;
  value: T;
  options: readonly PickerOption<T>[];
  onChange: (value: T) => void;
};

const inactiveBackgroundClassList = [
  "bg-transparent",
  "group-hover:bg-soft-hover",
  "group-active:bg-soft-active",
];
const activeBackgroundClassList = [
  "bg-accent",
  "group-hover:bg-accent-hover",
  "group-active:bg-accent-active",
];
const activeForegroundClassList = [
  "[--color-fg:var(--color-on-accent)]",
  "[--color-fg-strong:var(--color-on-accent)]",
  "[--color-fg-weak:var(--color-on-accent)]",
];
const inactiveBackgroundClasses = clsx(inactiveBackgroundClassList);
const activeBackgroundClasses = clsx(activeBackgroundClassList);
const activeForegroundClasses = clsx(activeForegroundClassList);

export function Picker<T extends string>(props: PickerProps<T>) {
  return (
    <Row
      class={clsx(
        props.class,
        "overflow-hidden rounded-sm border border-accent max-w-full",
      )}
    >
      {props.options.map((option, index) => (
        <SegmentedPickerButton
          key={option.value}
          class="shrink"
          label={option.label}
          active={option.value === props.value}
          last={index === props.options.length - 1}
          onClick={() => props.onChange(option.value)}
        />
      ))}
    </Row>
  );
}

type SegmentedPickerButtonProps = {
  class?: string;
  label: string;
  active: boolean;
  last: boolean;
  onClick: () => void;
};

function SegmentedPickerButton(props: SegmentedPickerButtonProps) {
  return (
    <Clickable
      class={clsx(props.class, "relative group min-h-8 min-w-0", {
        [activeForegroundClasses]: props.active,
        "border-r border-accent": !props.last,
      })}
      onClick={props.onClick}
    >
      <div
        class={clsx("absolute z-0 top-0 bottom-0 left-0 right-0", {
          [inactiveBackgroundClasses]: !props.active,
          [activeBackgroundClasses]: props.active,
        })}
      />
      <Row class="relative z-1 px-6 min-w-0" xAlign="center" yAlign="center">
        <TextBlock class="shrink min-w-0" align="center">
          {props.label}
        </TextBlock>
      </Row>
    </Clickable>
  );
}

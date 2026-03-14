import clsx from "clsx";
import { Clickable } from "@/web/components/core/Clickable";
import { Row } from "@/web/components/core/Row";
import { TextBlock } from "@/web/components/core/TextBlock";
import { useSettings } from "@/web/hooks/use-settings";
import { themes } from "@/web/data/theme";

const formattedThemes = {
  auto: "Auto",
  light: "Light",
  dark: "Dark",
};

const buttonBgInactiveClassList = [
  "bg-transparent",
  "group-hover:bg-soft-hover",
  "group-active:bg-soft-active",
];
const buttonBgActiveClassList = [
  "bg-accent",
  "group-hover:bg-accent-hover",
  "group-active:bg-accent-active",
];
const activeFgColorsClassList = [
  "[--color-fg:var(--color-on-accent)]",
  "[--color-fg-strong:var(--color-on-accent)]",
  "[--color-fg-weak:var(--color-on-accent)]",
];
const buttonBgInactiveClasses = clsx(buttonBgInactiveClassList);
const buttonBgActiveClasses = clsx(buttonBgActiveClassList);
const activeFgColors = clsx(activeFgColorsClassList);

type ThemePickerProps = {
  class?: string;
};

export function ThemePicker(props: ThemePickerProps) {
  const { settings, updateSettings } = useSettings();

  return (
    <Row class={clsx(props.class, "rounded-sm border border-accent")}>
      {themes.map((theme, index) => (
        <ThemeButton
          key={theme}
          text={formattedThemes[theme]}
          active={settings.theme === theme}
          last={index === themes.length - 1}
          onClick={() => {
            updateSettings((current) => current.with({ theme }));
          }}
        />
      ))}
    </Row>
  );
}

function ThemeButton(props: {
  text: string;
  active: boolean;
  last: boolean;
  onClick: () => void;
}) {
  return (
    <Clickable
      class={clsx("relative group h-8", {
        [activeFgColors]: props.active,
        "border-r border-accent": !props.last,
      })}
      onClick={props.onClick}
    >
      <div
        class={clsx("absolute z-0 top-0 bottom-0 left-0 right-0", {
          [buttonBgInactiveClasses]: !props.active,
          [buttonBgActiveClasses]: props.active,
        })}
      />
      <Row class="relative z-1 px-6" xAlign="center" yAlign="center">
        <TextBlock>{props.text}</TextBlock>
      </Row>
    </Clickable>
  );
}

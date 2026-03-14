import { Picker, type PickerOption } from "@/web/components/Picker";
import { useSettings } from "@/web/hooks/use-settings";
import { themes, type Theme } from "@/web/data/theme";

const formattedThemes: Record<Theme, string> = {
  auto: "Auto",
  light: "Light",
  dark: "Dark",
};

const themeOptions: readonly PickerOption<Theme>[] = themes.map((theme) => ({
  value: theme,
  label: formattedThemes[theme],
}));

type ThemePickerProps = {
  class?: string;
};

export function ThemePicker(props: ThemePickerProps) {
  const { settings, updateSettings } = useSettings();

  return (
    <Picker
      class={props.class}
      value={settings.theme}
      options={themeOptions}
      onChange={(theme: Theme) => {
        updateSettings((current) => current.with({ theme }));
      }}
    />
  );
}

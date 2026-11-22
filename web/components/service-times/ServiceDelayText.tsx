import { TextBlock } from "@/web/components/core/TextBlock";
import type { FormattedServiceDelay } from "@/web/components/service-times/formatted-service-times";

type ServiceDelayTextProps = {
  delay: FormattedServiceDelay;
};

export function ServiceDelayText(props: ServiceDelayTextProps) {
  const style = {
    green: "departure-info-success" as const,
    yellow: "departure-info-warning" as const,
    red: "departure-info-error" as const,
  }[props.delay.color];

  return <TextBlock style={style}>{props.delay.text}</TextBlock>;
}

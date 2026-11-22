import { TextBlock } from "@/web/components/core/TextBlock";
import type { FrontendServiceMovementTimeStringsDelay } from "@/web/data/service/frontend-service-movement-time-strings";

type DelayTextProps = {
  delay: FrontendServiceMovementTimeStringsDelay;
};

export function DelayText(props: DelayTextProps) {
  const style = {
    green: "departure-info-success" as const,
    yellow: "departure-info-warning" as const,
    red: "departure-info-error" as const,
  }[props.delay.color];

  return <TextBlock style={style}>{props.delay.text}</TextBlock>;
}

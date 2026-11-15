import { type ComponentChildren } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { nowContext } from "@/web/hooks/use-now";

type NowProviderProps = {
  children: ComponentChildren;
};

export function NowProvider(props: NowProviderProps) {
  const { Provider } = nowContext;

  const [currentMinute, setCurrentMinute] = useState(() => getCurrentMinute());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = getCurrentMinute();
      if (Temporal.Instant.compare(now, currentMinute) !== 0) {
        setCurrentMinute(now);
      }
    }, 1000);

    return () => clearInterval(interval);
  });

  const data = useMemo(() => ({ currentMinute }), [currentMinute]);

  return <Provider value={data}>{props.children}</Provider>;
}

function getCurrentMinute() {
  return Temporal.Now.zonedDateTimeISO("UTC")
    .round({
      smallestUnit: "minute",
      roundingMode: "floor",
    })
    .toInstant();
}

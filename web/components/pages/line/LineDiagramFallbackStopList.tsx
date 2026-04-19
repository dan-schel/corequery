import type { ComponentChildren } from "preact";
import clsx from "clsx";
import { useMemo } from "preact/hooks";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { Column } from "@/web/components/core/Column";
import { TextBlock } from "@/web/components/core/TextBlock";
import { LinkText } from "@/web/components/core/LinkText";
import { Alert } from "@/web/components/Alert";
import { useStaticData } from "@/web/hooks/use-static-data";

type LineDiagramFallbackStopListProps = {
  class?: string;
  children?: ComponentChildren;
  fallbackStopList: readonly number[];
};

export function LineDiagramFallbackStopList(
  props: LineDiagramFallbackStopListProps,
) {
  const { foda } = useFoundationalData();
  const { appName } = useStaticData();

  const sortedStops = useMemo(() => {
    return props.fallbackStopList
      .map((stopId) => foda.stops.require(stopId))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [foda.stops, props.fallbackStopList]);

  // TODO: The "Help me update" link currently goes to the debug page, but it's
  // not a great experience for the average user. I want to make a dedicated
  // page which helps the user update.
  //
  // It would use the versions API to check if the version is outdated, show a
  // loading spinner while waiting for the PWA to update, and give advice
  // dynamically ("try refreshing the page manually") if it gets stuck.
  //
  // This page could also explain what the deal is (how can a _website_ need to
  // update?), and we should replace the <OutdatedPwaControls> on the developer
  // info page with a link to it.
  return (
    <Column class={clsx(props.class, "gap-6")}>
      <TextBlock style="subtitle">Stops</TextBlock>
      <Alert type="info">
        <Column class="gap-6">
          <TextBlock>
            A neat little diagram is also available for this line, but it's of a
            new type, and so requires a newer version of {appName} to be able to
            view.{" "}
          </TextBlock>
          <TextBlock style="strong">
            <LinkText href="/debug">Help me update</LinkText>
          </TextBlock>
        </Column>
      </Alert>
      <ul class="flex-col flex list-disc list-inside gap-4">
        {sortedStops.map((stop) => (
          <TextBlock>
            <li>
              <LinkText href={`/stop/${stop.urlPath}`}>{stop.name}</LinkText>
            </li>
          </TextBlock>
        ))}
      </ul>
    </Column>
  );
}

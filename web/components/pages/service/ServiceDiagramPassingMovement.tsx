import { TextBlock } from "@/web/components/core/TextBlock";
import { LinkText } from "@/web/components/core/LinkText";
import { CorequeryUrls } from "@/web/pages/corequery-urls";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";

type ServiceDiagramPassingMovementProps = {
  class?: string;
  stopId: number;
};

export function ServiceDiagramPassingMovement(
  props: ServiceDiagramPassingMovementProps,
) {
  const { foda } = useFoundationalData();

  const stopData = foda.stops.require(props.stopId);
  const url = CorequeryUrls.stop(stopData.urlPath);

  return (
    <TextBlock class={props.class} style="skipped-stop">
      <LinkText href={url} style="subtle">
        Skips {stopData.name}
      </LinkText>
    </TextBlock>
  );
}

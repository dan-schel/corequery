import { ErrorMessage } from "@/web/components/ErrorMessage";

type MapDiagramErrorProps = {
  class?: string;
};

export function MapDiagramError(props: MapDiagramErrorProps) {
  return (
    <ErrorMessage
      class={props.class}
      text="An error occurred while rendering this diagram"
    />
  );
}

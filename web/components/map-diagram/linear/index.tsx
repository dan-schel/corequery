import type { LinearMapDiagramStructure } from "@/web/components/map-diagram/linear/types";
import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import {
  Canvas,
  type CreateControllerFunc,
} from "@/web/components/canvas/Canvas";
import { useCallback, useMemo } from "preact/hooks";
import { useSettings } from "@/web/hooks/use-settings";
import type { BaseMapDiagramCanvasData } from "@/web/components/map-diagram/base/types";
import { LinearMapDiagramController } from "@/web/components/map-diagram/linear/controller";
import { Column } from "@/web/components/core/Column";
import { MapDiagramError } from "@/web/components/map-diagram/base/Error";

export const STOPS_SECTION_CLASS = "_diagram-stops";

const spacingClasses = {
  regular: "gap-6",
  loose: "gap-8",
};

type LinearMapDiagramProps = {
  class?: string;
  structure: LinearMapDiagramStructure;
  lightThemeColorHexCode: string | null;
  darkThemeColorHexCode: string | null;
  spacing?: keyof typeof spacingClasses;
};

export function LinearMapDiagram(props: LinearMapDiagramProps) {
  const { settings } = useSettings();

  const spacingClass = spacingClasses[props.spacing ?? "regular"];

  const data = useMemo<BaseMapDiagramCanvasData<LinearMapDiagramStructure>>(
    () => ({
      structure: props.structure,
      lightThemeColorHexCode: props.lightThemeColorHexCode,
      darkThemeColorHexCode: props.darkThemeColorHexCode,
      colorTheme: settings.theme,
    }),
    [
      props.darkThemeColorHexCode,
      props.lightThemeColorHexCode,
      props.structure,
      settings.theme,
    ],
  );

  const createController = useCallback<
    CreateControllerFunc<BaseMapDiagramCanvasData<LinearMapDiagramStructure>>
  >(
    (canvasContainer, canvas) =>
      new LinearMapDiagramController(canvasContainer, canvas),
    [],
  );

  if (data.structure.stops.length < 2) {
    return <MapDiagramError />;
  }

  return (
    <Grid class={clsx(props.class, "grid-cols-[auto_1fr] gap-4")}>
      <Canvas<BaseMapDiagramCanvasData<LinearMapDiagramStructure>>
        class="w-4"
        createController={createController}
        data={data}
      />
      <Column class={clsx(spacingClass)}>
        {props.structure.continuingAboveContent}
        <Column class={clsx(spacingClass, STOPS_SECTION_CLASS)}>
          {props.structure.stops.map((stop, i) => (
            <Grid key={i}>{stop.content}</Grid>
          ))}
        </Column>
        {props.structure.continuingBelowContent}
      </Column>
    </Grid>
  );
}

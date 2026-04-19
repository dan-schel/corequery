import clsx from "clsx";
import { Column } from "@/web/components/core/Column";
import { TextBlock } from "@/web/components/core/TextBlock";
import type {
  FodaLine,
  FodaLineDiagramEntry,
} from "@/web/data/foundational-data/foda-line-collection";
import { LineDiagramFallbackStopList } from "@/web/components/pages/line/LineDiagramFallbackStopList";
import { Picker } from "@/web/components/Picker";
import { useMemo, useState } from "preact/hooks";
import { itsOk, parseIntThrow } from "@dan-schel/js-utils";
import { LineDiagramViewer } from "@/web/components/pages/line/LineDiagramViewer";

type LineDiagramSectionProps = {
  class?: string;
  diagram: FodaLine["diagram"];
};

export function LineDiagramSection(props: LineDiagramSectionProps) {
  const understoodEntries = props.diagram.entries.filter(
    (entry): entry is FodaLineDiagramEntry => entry.type === "linear",
  );

  if (understoodEntries.length < props.diagram.entries.length) {
    return (
      <LineDiagramFallbackStopList
        fallbackStopList={props.diagram.fallbackStopList}
      />
    );
  }

  return (
    <Column class={clsx(props.class, "gap-6")}>
      <TextBlock style="subtitle">Diagram</TextBlock>
      {understoodEntries.length === 1 ? (
        <LineDiagramViewer diagram={itsOk(understoodEntries[0])} />
      ) : (
        <LineDiagramEntrySelector
          key={understoodEntries.length}
          entries={understoodEntries}
        />
      )}
    </Column>
  );
}

type LineDiagramEntrySelectorProps = {
  entries: readonly FodaLineDiagramEntry[];
};

function LineDiagramEntrySelector(props: LineDiagramEntrySelectorProps) {
  const [selectedEntryIndex, setSelectedEntryIndex] = useState(0);

  const options = useMemo(() => {
    return props.entries.map((entry, index) => ({
      value: index.toFixed(),
      label: entry.name ?? `Route ${index + 1}`,
    }));
  }, [props.entries]);

  return (
    <Column class="gap-4">
      <Picker
        class="self-start"
        value={selectedEntryIndex.toFixed()}
        options={options}
        onChange={(value: string) => {
          setSelectedEntryIndex(parseIntThrow(value));
        }}
      />
      <LineDiagramViewer diagram={itsOk(props.entries[selectedEntryIndex])} />
    </Column>
  );
}

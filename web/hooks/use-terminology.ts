import { useMemo } from "preact/hooks";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";

const stopFormattingSchemes = {
  stop: (x: string) => x,
  station: (x: string) => `${x} Station`,
};

const lineFormattingSchemes = {
  line: (x: string) => `${x} Line`,
  route: (x: string) => `Route ${x}`,
};

const pluralStopsTerms = {
  stop: "stops",
  station: "stations",
};

const pluralLinesTerms = {
  line: "lines",
  route: "routes",
};

export function useTerminology() {
  const { foda } = useFoundationalData();

  return useMemo(() => {
    return {
      formatStop: stopFormattingSchemes[foda.terminology.stop],
      formatLine: lineFormattingSchemes[foda.terminology.line],
      pluralStopsTerm: pluralStopsTerms[foda.terminology.stop],
      pluralLinesTerm: pluralLinesTerms[foda.terminology.line],
    };
  }, [foda.terminology]);
}

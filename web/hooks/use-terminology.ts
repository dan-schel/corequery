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

const singularServiceTerm = {
  service: "service",
  trip: "trip",
  train: "train",
  tram: "tram",
  bus: "bus",
};

const pluralServicesTerms = {
  service: "services",
  trip: "trips",
  train: "trains",
  tram: "trams",
  bus: "buses",
};

const positionIndicatorHeaders = {
  "platform": "Platform",
  "track": "Track",
  "bay": "Bay",
  "wharf": "Wharf",
  "wharf-and-side": "Wharf/Side",
  "stand": "Stand",
};

export function useTerminology() {
  const { foda } = useFoundationalData();

  return useMemo(() => {
    return {
      formatStop: stopFormattingSchemes[foda.terminology.stop],
      formatLine: lineFormattingSchemes[foda.terminology.line],
      pluralStopsTerm: pluralStopsTerms[foda.terminology.stop],
      pluralLinesTerm: pluralLinesTerms[foda.terminology.line],
      singularServiceTerm: singularServiceTerm[foda.terminology.service],
      pluralServicesTerm: pluralServicesTerms[foda.terminology.service],
      positionIndicatorHeader:
        positionIndicatorHeaders[foda.terminology.stopPosition],
    };
  }, [foda.terminology]);
}

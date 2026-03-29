import type { SearchCandidate } from "@/web/components/search/algorithm/types";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { useMemo } from "preact/hooks";
import type { Icon } from "@/web/components/icons/type";
import { MingcuteLocationLine } from "@/web/components/icons/MingcuteLocationLine";
import { MingcuteGitCommitLine } from "@/web/components/icons/MingcuteGitCommitLine";

export type PageSearchCandidateData = {
  name: string;
  url: string;
  icon: Icon;
};
type PageSearchCandidate = SearchCandidate<PageSearchCandidateData>;
type Result = {
  candidates: readonly PageSearchCandidate[];
  placeholder: string;
};

export function usePageSearch(): Result {
  const { foda } = useFoundationalData();

  const candidates = useMemo(() => {
    // I imagine lots of places will need these in the future, so maybe consider
    // adding a useTerminology hook or something when that time comes.
    const stopFormatter = {
      stop: (x: string) => x,
      station: (x: string) => `${x} Station`,
    }[foda.terminology.stop];

    const lineFormatter = {
      line: (x: string) => `${x} Line`,
      route: (x: string) => `Route ${x}`,
    }[foda.terminology.line];

    const stops = foda.stops.map<PageSearchCandidate>((x) => ({
      id: `stop-${x.id}`,
      primary: stopFormatter(x.name),
      alternatives: [],
      data: {
        name: stopFormatter(x.name),
        url: `/stops/${x.urlPath}`,
        icon: MingcuteLocationLine,
      },
    }));

    const lines = foda.lines.map<PageSearchCandidate>((x) => ({
      id: `lines-${x.id}`,
      primary: lineFormatter(x.name),
      alternatives: [],
      data: {
        name: lineFormatter(x.name),
        url: `/lines/${x.urlPath}`,
        icon: MingcuteGitCommitLine,
      },
    }));

    return [...stops, ...lines];
  }, [foda]);

  const placeholder = useMemo(() => {
    const stopsTerm = {
      stop: "stops",
      station: "stations",
    }[foda.terminology.stop];

    const linesTerm = {
      line: "lines",
      route: "routes",
    }[foda.terminology.line];

    return `Search ${stopsTerm}, ${linesTerm}, or pages`;
  }, [foda]);

  return { candidates, placeholder };
}

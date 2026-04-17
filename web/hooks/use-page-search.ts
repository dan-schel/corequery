import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { useMemo } from "preact/hooks";
import type { Icon } from "@/web/components/icons/type";
import { MingcuteLocationLine } from "@/web/components/icons/MingcuteLocationLine";
import { MingcuteGitCommitLine } from "@/web/components/icons/MingcuteGitCommitLine";
import type { SearchCandidate } from "@/web/data/search/types";
import { useTerminology } from "@/web/hooks/use-terminology";

type PageSearchCandidateData = {
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
  const { formatStop, formatLine, pluralStopsTerm, pluralLinesTerm } =
    useTerminology();

  const candidates = useMemo(() => {
    const stops = foda.stops.map<PageSearchCandidate>((x) => ({
      id: `stop-${x.id}`,
      primary: formatStop(x.name),
      alternatives: [],
      data: {
        name: formatStop(x.name),
        url: `/stop/${x.urlPath}`,
        icon: MingcuteLocationLine,
      },
    }));

    const lines = foda.lines.map<PageSearchCandidate>((x) => ({
      id: `line-${x.id}`,
      primary: formatLine(x.name),
      alternatives: [],
      data: {
        name: formatLine(x.name),
        url: `/line/${x.urlPath}`,
        icon: MingcuteGitCommitLine,
      },
    }));

    return [...stops, ...lines];
  }, [foda.lines, foda.stops, formatLine, formatStop]);

  const placeholder = useMemo(() => {
    return `Search ${pluralStopsTerm}, ${pluralLinesTerm}, etc.`;
  }, [pluralLinesTerm, pluralStopsTerm]);

  return { candidates, placeholder };
}

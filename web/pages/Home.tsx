import { Column } from "@/web/components/core/Column";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/use-simple-headers";
import { Markdown } from "@/web/components/markdown/Markdown";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { QuasilinearStopDiagram } from "@/web/components/quasilinear-stop-diagram/QuasilinearStopDiagram";
import { useMemo } from "preact/hooks";
import { TextBlock } from "@/web/components/core/TextBlock";
import type { QuasilinearStopDiagramStructure } from "@/web/components/quasilinear-stop-diagram/structure-types";

export default function Home() {
  const { foda } = useFoundationalData();

  // const structure = useMemo<QuasilinearStopDiagramStructure>(() => {
  //   return {
  //     type: "linear",
  //     stops: [
  //       { content: <TextBlock>Alphington</TextBlock> },
  //       { content: <TextBlock>Berwick</TextBlock> },
  //       { content: <TextBlock>Cheltenham</TextBlock> },
  //       { content: <TextBlock>Darling</TextBlock> },
  //       { content: <TextBlock>Epping</TextBlock> },
  //     ],
  //   };
  // }, []);

  const structure = useMemo<QuasilinearStopDiagramStructure>(() => {
    return {
      type: "branch",
      commonStops: [
        { content: <TextBlock>Alphington</TextBlock> },
        { content: <TextBlock>Berwick</TextBlock> },
        { content: <TextBlock>Cheltenham</TextBlock> },
        { content: <TextBlock>Darling</TextBlock> },
        { content: <TextBlock>Epping</TextBlock> },
      ],
      branchAStops: [
        { content: <TextBlock>Fairfield</TextBlock> },
        { content: <TextBlock>Geelong</TextBlock> },
      ],
      branchBStops: [
        { content: <TextBlock>Highett</TextBlock> },
        { content: <TextBlock>Ivanhoe</TextBlock> },
        { content: <TextBlock>Jewell</TextBlock> },
      ],
    };
  }, []);

  return (
    <Page {...useSimpleHeaders({ title: "Home" })}>
      <Column class="px-4 py-8 gap-12">
        <Markdown markdown={foda.landingPage.primaryMarkdown} />
        <QuasilinearStopDiagram
          structure={structure}
          lightThemeColorHexCode="#ffffff"
          darkThemeColorHexCode="#ffffff"
        />
      </Column>
    </Page>
  );
}

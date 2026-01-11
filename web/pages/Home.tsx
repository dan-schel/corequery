import { useEffect } from "preact/hooks";
import { Nav } from "../components/Nav";
import { runSharedCode } from "../../shared/example";
import { PwaStatus } from "../components/PwaStatus";
import { useStaticData } from "../data/static-data";
import { TextBlock } from "../components/core/TextBlock";
import { Column } from "../components/core/Column";

export default function Home() {
  const { appName } = useStaticData();

  useEffect(() => {
    runSharedCode();
  }, []);

  return (
    <Column class="gap-2">
      <TextBlock style="title">{appName} - Home</TextBlock>
      <Nav />
      <PwaStatus />
    </Column>
  );
}

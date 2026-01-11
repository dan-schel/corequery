import { Column } from "../components/common/Column";
import { TextBlock } from "../components/common/TextBlock";
import { Nav } from "../components/Nav";
import { useStaticData } from "../data/static-data";

export default function NotFound() {
  const { appName } = useStaticData();

  return (
    <Column class="gap-2">
      <TextBlock style="title">{appName} - Not Found</TextBlock>
      <Nav />
    </Column>
  );
}

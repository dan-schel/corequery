import { Column } from "../components/common/Column";
import { TextBlock } from "../components/common/TextBlock";
import { Nav } from "../components/Nav";
import { useStaticData } from "../data/static-data";

export default function About() {
  const { appName } = useStaticData();

  return (
    <Column class="gap-2">
      <TextBlock style="title">{appName} - About</TextBlock>
      <Nav />
      <TextBlock>
        This is text so long that it needs to wrap. Lorem ipsum dolor sit amet
        consectetur adipisicing elit. Earum corporis, autem expedita, minus
        voluptatem ex voluptatum quis illum, quae dicta eius amet soluta
        consequatur beatae deleniti repellendus? Eos impedit adipisci molestiae
        similique quae corporis accusantium voluptates? Quod odit est ea id
        nihil in saepe minus quia tempore illum, dolorum, atque facilis natus
        delectus ratione omnis mollitia! Eveniet aliquam nam temporibus velit
        quae iusto facere, earum rerum, voluptate saepe officiis accusamus
        laboriosam maiores porro. Ratione odio ea recusandae eligendi aspernatur
        officia sunt perspiciatis maxime? Reiciendis ad beatae similique libero?
        Perspiciatis dignissimos non placeat veniam repudiandae dolore fuga
        facere! Ullam, quidem dolore!
      </TextBlock>
    </Column>
  );
}

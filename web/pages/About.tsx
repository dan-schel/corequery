import { Column } from "@/web/components/core/Column";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Nav } from "@/web/components/Nav";
import { useStaticData } from "@/web/data/static-data";
import { Grid } from "@/web/components/core/Grid";
import { Button } from "@/web/components/button/Button";
import { UilRedo } from "@/web/components/icons/UilRedo";

export default function About() {
  const { appName } = useStaticData();

  return (
    <Column class="px-4 py-8 gap-8">
      <Column class="gap-4">
        <TextBlock style="title" oneLine>
          {appName} - About
        </TextBlock>
        <Nav />
      </Column>
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
      <Grid class="grid-cols-[auto_auto_auto] gap-4 max-w-120">
        <Button text="Hello" />
        <Button text="Hello" icon={UilRedo} />
        <Button icon={UilRedo} />
        <Button text="Hello" loading />
        <Button text="Hello" icon={UilRedo} loading />
        <Button icon={UilRedo} loading />
        <Button text="Hello" disabled />
        <Button text="Hello" icon={UilRedo} disabled />
        <Button icon={UilRedo} disabled />
      </Grid>
      <Grid class="grid-cols-[auto_auto_auto] gap-4 self-start">
        <Button text="Hello" />
        <Button text="Hello" icon={UilRedo} />
        <Button icon={UilRedo} />
        <Button text="Hello" loading />
        <Button text="Hello" icon={UilRedo} loading />
        <Button icon={UilRedo} loading />
        <Button text="Hello" disabled />
        <Button text="Hello" icon={UilRedo} disabled />
        <Button icon={UilRedo} disabled />
      </Grid>
    </Column>
  );
}

import { Column } from "@/web/components/core/Column";
import { TextBlock } from "@/web/components/core/TextBlock";
import { useStaticData } from "@/web/data/static-data";
import { Page } from "@/web/components/page/Page";
import { useSimpleHeaders } from "@/web/components/page/use-simple-headers";
import { LinkText } from "@/web/components/core/LinkText";

export default function About() {
  const { appName } = useStaticData();

  return (
    <Page {...useSimpleHeaders({ title: "About" })}>
      <Column class="px-4 py-8 gap-12">
        <Column class="gap-8">
          <TextBlock style="title">About {appName}</TextBlock>
          <TextBlock>
            This is text so long that it needs to wrap. Lorem ipsum dolor sit
            amet consectetur adipisicing elit. Earum corporis, autem expedita,
            minus voluptatem ex voluptatum quis illum, quae dicta eius amet
            soluta consequatur beatae{" "}
            <LinkText href="/deleniti-repellendus">
              deleniti repellendus
            </LinkText>
            ? Eos impedit adipisci molestiae similique quae corporis accusantium
            voluptates? Quod odit est ea id nihil in saepe minus quia tempore
            illum, dolorum, atque facilis natus delectus ratione omnis mollitia!
            Eveniet aliquam nam temporibus velit quae iusto facere, earum rerum,
            voluptate saepe officiis accusamus laboriosam maiores porro.
          </TextBlock>
          <TextBlock>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse
            quisquam molestias, cumque distinctio, laborum optio quam aut quasi
            rem tempora, minima placeat labore dolor maiores expedita pariatur
            reprehenderit mollitia modi.
          </TextBlock>
        </Column>
        <Column class="gap-6">
          <TextBlock style="subtitle">Mmm, yes</TextBlock>
          <TextBlock>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti
            eos quisquam laborum in eveniet officiis ab, perferendis ipsam natus
            doloribus, qui ratione sit. Eos eligendi voluptatibus, nesciunt
            asperiores commodi nemo minima beatae veritatis omnis magnam ipsam
            minus enim ab dolorem nulla.
          </TextBlock>
        </Column>
        <Column class="gap-6">
          <TextBlock style="subtitle">I simply must agree</TextBlock>
          <TextBlock>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
            fugiat officia, culpa asperiores architecto recusandae beatae illum
            aliquam magni ab sed a soluta id quae tenetur. Sit facere iste harum
            dolorum molestias omnis animi vitae. Expedita voluptatum
            perspiciatis dolor ex quam, tempore voluptates culpa ab nisi,
            officia iure reiciendis. Atque quis, amet recusandae quisquam iure
            fugiat tenetur voluptate harum inventore doloremque deleniti
            repudiandae, facere, praesentium temporibus quidem modi culpa
            similique eum ea architecto dolorem? Optio natus officiis,
            architecto necessitatibus ab accusamus placeat. Similique, ea
            mollitia excepturi neque nam odit doloremque molestias deleniti
            praesentium officia veniam dolorem cumque temporibus quos possimus
            error libero nisi voluptate reiciendis! Officiis dolorem fugit at
            dignissimos.
          </TextBlock>
        </Column>
        <Column class="gap-6">
          <TextBlock style="subtitle">Good chat</TextBlock>
          <TextBlock>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsa magni
            repudiandae tempore? Repellendus, fugit iusto!
          </TextBlock>
        </Column>
      </Column>
    </Page>
  );
}

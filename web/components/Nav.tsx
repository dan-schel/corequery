import { LinkText } from "@/web/components/core/LinkText";
import { Row } from "@/web/components/core/Row";
import { TextBlock } from "@/web/components/core/TextBlock";

export function Nav() {
  return (
    <Row as="nav" class="gap-4">
      <TextBlock>
        <LinkText href="/">Home</LinkText>
      </TextBlock>
      <TextBlock>
        <LinkText href="/about">About</LinkText>
      </TextBlock>
      <TextBlock>
        <LinkText href="/bacon">Not Found</LinkText>
      </TextBlock>
    </Row>
  );
}

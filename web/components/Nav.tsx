import { Row } from "./core/Row";
import { TextBlock } from "./core/TextBlock";

export function Nav() {
  return (
    <Row as="nav" class="gap-4">
      <TextBlock>
        <a href="/">Home</a>
      </TextBlock>
      <TextBlock>
        <a href="/about">About</a>
      </TextBlock>
      <TextBlock>
        <a href="/bacon">Not Found</a>
      </TextBlock>
    </Row>
  );
}

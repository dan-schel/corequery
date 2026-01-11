import { Row } from "./common/Row";
import { TextBlock } from "./common/TextBlock";

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

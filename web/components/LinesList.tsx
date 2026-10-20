import clsx from "clsx";
import {
  TextBlock,
  type TextBlockProps,
} from "@/web/components/core/TextBlock";
import { itsOk } from "@dan-schel/js-utils";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { LinkText } from "@/web/components/core/LinkText";
import { useMemo } from "preact/hooks";
import type { FoundationalData } from "@/web/data/foundational-data";

type LinesListProps = {
  class?: string;
  style?: TextBlockProps["style"];
  lineIds: readonly number[];
  withLinks?: boolean;
};

export function LinesList(props: LinesListProps) {
  const withLinks = props.withLinks ?? false;

  return (
    <TextBlock class={clsx(props.class)} style={props.style}>
      <Content lineIds={props.lineIds} withLinks={withLinks} />
    </TextBlock>
  );
}

function Content({
  lineIds,
  withLinks,
}: {
  lineIds: readonly number[];
  withLinks: boolean;
}) {
  const { foda } = useFoundationalData();

  if (lineIds.length === 0) {
    return {
      line: "No lines",
      route: "No routes",
    }[foda.terminology.line];
  }

  const lineNames = <LineNames lineIds={lineIds} withLinks={withLinks} />;

  return {
    line: (
      <>
        {lineNames} {lineIds.length === 1 ? "Line" : "lines"}
      </>
    ),
    route: (
      <>
        {lineIds.length === 1 ? "Route" : "Routes"} {lineNames}
      </>
    ),
  }[foda.terminology.line];
}

function LineNames({
  lineIds,
  withLinks,
}: {
  lineIds: readonly number[];
  withLinks: boolean;
}) {
  const { foda } = useFoundationalData();

  const lineData = useMemo(() => {
    return lineIds
      .map((x) => extractLineData(x, foda))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [lineIds, foda]);

  if (lineData.length === 1) {
    return <LineName data={itsOk(lineData[0])} withLink={withLinks} />;
  } else if (lineData.length === 2) {
    return (
      <>
        <LineName data={itsOk(lineData[0])} withLink={withLinks} /> and{" "}
        <LineName data={itsOk(lineData[1])} withLink={withLinks} />
      </>
    );
  } else {
    return (
      <>
        {lineData.slice(0, -1).map((x, i) => (
          <>
            <LineName key={i} data={itsOk(x)} withLink={withLinks} />,{" "}
          </>
        ))}
        {" and "}
        <LineName
          data={itsOk(lineData[lineData.length - 1])}
          withLink={withLinks}
        />
      </>
    );
  }
}

function LineName({
  data,
  withLink,
}: {
  data: ReturnType<typeof extractLineData>;
  withLink: boolean;
}) {
  if (withLink) {
    return (
      <LinkText
        href={data.href}
        style="strong-subtle"
        dynamicColor={data.color}
      >
        {data.name}
      </LinkText>
    );
  } else {
    return <>{data.name}</>;
  }
}

function extractLineData(lineId: number, foda: FoundationalData) {
  const line = foda.lines.require(lineId);

  return {
    name: line.name,
    href: `/line/${line.urlPath}`,
    color: line.color,
  };
}

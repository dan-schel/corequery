import clsx from "clsx";
import type { VNode } from "preact";

const tailwindSizeScale = [
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
  "9xl",
];

type CoreTextProps = {
  children: VNode;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  align?: "left" | "center" | "right" | "justify";
  oneLine?: boolean;
  className?: string;
};

/**
 * Renders text.
 *
 * Rules:
 * - Do not nest `<CoreText>` elements.
 * - Never use `className` for margin/padding on `<CoreText>`.
 */
export function CoreText(props: CoreTextProps) {
  const Tag = props.as ?? "span";

  const align = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  }[props.align ?? "left"];

  if (props.oneLine) {
    const className = props.className ?? "";
    const { sizeStyles, otherStyles } = extractTextSizeStyles(className);

    return (
      <div className={clsx("_one-line", sizeStyles)}>
        <Tag className={clsx(otherStyles, align, "_text")}>
          {props.children}
        </Tag>
      </div>
    );
  } else {
    return (
      <Tag className={clsx(props.className, align, "_text")}>
        {props.children}
      </Tag>
    );
  }
}

function extractTextSizeStyles(className: string) {
  const classes = className.split(" ");
  const sizeStyles: string[] = [];
  const otherStyles: string[] = [];

  for (const c of classes) {
    if (
      tailwindSizeScale.some((s) => c === `text-${s}`) ||
      c.startsWith("text-[")
    ) {
      sizeStyles.push(c);
    } else {
      otherStyles.push(c);
    }
  }

  return { sizeStyles, otherStyles };
}

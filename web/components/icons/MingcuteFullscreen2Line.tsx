import type { SVGAttributes } from "preact";

export function MingcuteFullscreen2Line(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 20H4v-5m0 5l6.5-6.5M15 4h5v5m0-5l-6.5 6.5"
      />
    </svg>
  );
}

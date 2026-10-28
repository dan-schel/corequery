import type { SVGAttributes } from "preact";

export function MingcuteCalendarXLine(props: SVGAttributes<SVGSVGElement>) {
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
        d="M11 20H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4H4m12-7v2M8 4v2m12.121 9.879L18 18m0 0l-2.121 2.121M18 18l-2.121-2.121M18 18l2.121 2.121"
      />
    </svg>
  );
}

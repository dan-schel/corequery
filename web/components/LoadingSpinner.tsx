import clsx from "clsx";

const styles = {
  default: "text-xl text-fg-weak",
  large: "text-2xl text-fg-weak",
};

type LoadingSpinnerProps = {
  class?: string;
  style?: keyof typeof styles;
};

export function LoadingSpinner(props: LoadingSpinnerProps) {
  return (
    <svg
      className={clsx(
        "_loading-spinner",
        styles[props.style ?? "default"],
        props.class,
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      role="img"
    >
      <title>Loading spinner</title>
      <circle cx="8" cy="8" r="2" fill="currentColor" />
      <circle cx="16" cy="8" r="2" fill="currentColor" />
      <circle cx="16" cy="16" r="2" fill="currentColor" />
      <circle cx="8" cy="16" r="2" fill="currentColor" />
    </svg>
  );
}

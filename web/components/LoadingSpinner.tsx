import clsx from "clsx";

const styles = {
  default: "text-lg text-fg-weak",
  large: "text-xl text-fg-weak",
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
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      role="img"
    >
      <title>Loading spinner</title>
      <circle cx="4" cy="4" r="2" fill="currentColor" />
      <circle cx="12" cy="4" r="2" fill="currentColor" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="4" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

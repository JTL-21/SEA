import cn from "clsx";

const PriorityVeryHigh = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    className={cn("-rotate-45 text-rose-600", className)}
    {...props}
  >
    <path
      fill="currentColor"
      d="m10.25 22.25l-8.5-8.5q-.275-.275-.275-.7t.275-.7l10.6-10.6q.275-.275.688-.275t.712.3l8.5 8.475q.275.275.275.7t-.275.7l-10.6 10.6q-.275.275-.7.275t-.7-.275Z"
    />
  </svg>
);

export default PriorityVeryHigh;

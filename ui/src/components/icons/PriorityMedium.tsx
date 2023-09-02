import cn from "clsx";

const PriorityMedium = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    className={cn("-rotate-45 text-emerald-300", className)}
    {...props}
  >
    <path
      fill="currentColor"
      d="m7.75 19.75l-3.525-3.525q-.275-.275-.275-.7t.275-.7L14.8 4.225q.3-.3.725-.3t.7.3l3.525 3.55q.275.275.275.7t-.275.7L9.175 19.75q-.3.3-.713.3t-.712-.3Z"
    />
  </svg>
);

export default PriorityMedium;

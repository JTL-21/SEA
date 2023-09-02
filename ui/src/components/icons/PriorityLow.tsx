import cn from "clsx";

const PriorityLow = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    className={cn("text-cyan-400", className)}
    {...props}
  >
    <path
      fill="currentColor"
      d="m7.05 19.05l-2.1-2.1q-.3-.3-.3-.713t.3-.712L15.525 4.95q.3-.3.713-.3t.712.3l2.1 2.125q.275.275.275.7t-.275.7L8.475 19.05q-.3.3-.713.3t-.712-.3Z"
    />
  </svg>
);

export default PriorityLow;

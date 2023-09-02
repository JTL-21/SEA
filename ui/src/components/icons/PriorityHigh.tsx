import cn from "clsx";

const PriorityHigh = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    className={cn("-rotate-45 text-amber-400", className)}
    {...props}
  >
    <path
      fill="currentColor"
      d="m8.825 20.825l-5.65-5.65q-.3-.3-.3-.713t.3-.712L13.75 3.175q.3-.3.713-.3t.687.3l5.675 5.65q.3.3.3.713t-.3.712L10.25 20.825q-.3.3-.713.3t-.712-.3Z"
    />
  </svg>
);

export default PriorityHigh;

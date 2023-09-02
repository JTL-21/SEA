import cn from "clsx";

const PriorityVeryLow = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    className={cn("-rotate-45 text-gray-300", className)}
    {...props}
  >
    <path
      fill="currentColor"
      d="m6.7 18.7l-1.4-1.4Q5 17 5 16.587t.3-.712L15.875 5.3q.3-.3.713-.3t.712.3l1.4 1.4q.3.3.3.713t-.3.712L8.1 18.7q-.275.275-.7.275t-.7-.275Z"
    />
  </svg>
);

export default PriorityVeryLow;
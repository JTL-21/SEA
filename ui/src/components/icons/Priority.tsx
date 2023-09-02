import React from "react";
import cn from "../../utils/cn";
import { Ticket } from "../../types";

interface PriorityProps extends React.SVGProps<SVGSVGElement> {
  priority: Ticket["priority"];
}

const priorityIconMap = {
  VERY_LOW: {
    classes: "text-gray-300",
    path: (
      <path
        fill="currentColor"
        d="m6.7 18.7l-1.4-1.4Q5 17 5 16.587t.3-.712L15.875 5.3q.3-.3.713-.3t.712.3l1.4 1.4q.3.3.3.713t-.3.712L8.1 18.7q-.275.275-.7.275t-.7-.275Z"
      />
    ),
  },
  LOW: {
    classes: "text-cyan-400",
    path: (
      <path
        fill="currentColor"
        d="m7.05 19.05l-2.1-2.1q-.3-.3-.3-.713t.3-.712L15.525 4.95q.3-.3.713-.3t.712.3l2.1 2.125q.275.275.275.7t-.275.7L8.475 19.05q-.3.3-.713.3t-.712-.3Z"
      />
    ),
  },
  MEDIUM: {
    classes: "text-emerald-300",
    path: (
      <path
        fill="currentColor"
        d="m7.75 19.75l-3.525-3.525q-.275-.275-.275-.7t.275-.7L14.8 4.225q.3-.3.725-.3t.7.3l3.525 3.55q.275.275.275.7t-.275.7L9.175 19.75q-.3.3-.713.3t-.712-.3Z"
      />
    ),
  },
  HIGH: {
    classes: "text-amber-400",
    path: (
      <path
        fill="currentColor"
        d="m8.825 20.825l-5.65-5.65q-.3-.3-.3-.713t.3-.712L13.75 3.175q.3-.3.713-.3t.687.3l5.675 5.65q.3.3.3.713t-.3.712L10.25 20.825q-.3.3-.713.3t-.712-.3Z"
      />
    ),
  },
  VERY_HIGH: {
    classes: "text-rose-600",
    path: (
      <path
        fill="currentColor"
        d="m10.25 22.25l-8.5-8.5q-.275-.275-.275-.7t.275-.7l10.6-10.6q.275-.275.688-.275t.712.3l8.5 8.475q.275.275.275.7t-.275.7l-10.6 10.6q-.275.275-.7.275t-.7-.275Z"
      />
    ),
  },
};

const Priority = ({ priority, className, ...svgProps }: PriorityProps) => {
  const iconData = priorityIconMap[priority];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      className={cn(iconData.classes, className)}
      {...svgProps}
    >
      {iconData.path}
    </svg>
  );
};

export default Priority;

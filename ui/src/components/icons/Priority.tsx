import { Ticket } from "../../types";
import PriorityVeryLow from "./PriorityVeryLow";
import PriorityLow from "./PriorityLow";
import PriorityMedium from "./PriorityMedium";
import PriorityHigh from "./PriorityHigh";
import PriorityVeryHigh from "./PriorityVeryHigh";
import React, { JSXElementConstructor } from "react";

interface PriorityProps extends React.SVGProps<SVGSVGElement> {
  priority: Ticket["priority"];
}

const priorityIconMap: Record<
  Ticket["priority"],
  JSXElementConstructor<React.SVGProps<SVGSVGElement>>
> = {
  VERY_LOW: PriorityVeryLow,
  LOW: PriorityLow,
  MEDIUM: PriorityMedium,
  HIGH: PriorityHigh,
  VERY_HIGH: PriorityVeryHigh,
};

const Priority = ({ priority, ...svgProps }: PriorityProps) => {
  const Element = priorityIconMap[priority];
  return <Element {...svgProps} />;
};

export default Priority;

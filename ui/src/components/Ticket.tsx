import { Ticket } from "../types";
import { useDraggable } from "@dnd-kit/core";
import cn from "clsx";
import PriorityVeryLow from "./icons/PriorityVeryLow";
import PriorityLow from "./icons/PriorityLow";
import PriorityMedium from "./icons/PriorityMedium";
import PriorityHigh from "./icons/PriorityHigh";
import PriorityVeryHigh from "./icons/PriorityVeryHigh";
import React from "react";
import AccountCircleIcon from "./icons/AccountCircleIcon";

interface TicketComponentProps {
  ticket: Ticket;
  onClick?: (slug: string) => void;
}

const priorityIconMap: Record<Ticket["priority"], React.ReactNode> = {
  VERY_LOW: <PriorityVeryLow />,
  LOW: <PriorityLow />,
  MEDIUM: <PriorityMedium />,
  HIGH: <PriorityHigh />,
  VERY_HIGH: <PriorityVeryHigh />,
};

const statusNameMap: Record<Ticket["status"], string> = {
  WAITING: "Waiting",
  IN_PROGRESS: "In Progress",
  IN_TEST: "In Test",
  DONE: "Done",
};

const priorityNameMap: Record<Ticket["priority"], string> = {
  VERY_LOW: "Very Low",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  VERY_HIGH: "Very High",
};

const TicketComponent = ({ ticket, onClick }: TicketComponentProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: ticket.slug,
  });

  const onMouseUp = () => onClick && onClick(ticket.slug);

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-sm bg-white p-2 text-sm",
        isDragging ? "cursor-grabbing opacity-50" : "cursor-pointer"
      )}
      style={{ boxShadow: "0 0 4px 0px rgba(0,0,0,15%)" }}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onMouseUp={onMouseUp}
    >
      <div className="text-sm text-gray-600">{ticket.title}</div>
      <div className="flex items-center gap-[0.5]">
        <span className="font-semibold text-gray-500">{ticket.slug}</span>
        <div
          className="ml-auto rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-500"
          title={`${ticket.points} points`}
        >
          {ticket.points}
        </div>
        <div
          className="[&>svg]:h-8 [&>svg]:w-8"
          title={`${priorityNameMap[ticket.priority]} Priority`}
        >
          {priorityIconMap[ticket.priority]}
        </div>
        <div title={ticket.author.username} className="flex gap-1 ">
          <AccountCircleIcon className="h-6 w-6 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default TicketComponent;
export { priorityIconMap, priorityNameMap, statusNameMap };

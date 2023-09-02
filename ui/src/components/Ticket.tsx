import { Ticket } from "../types";
import { useDraggable } from "@dnd-kit/core";
import cn from "clsx";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Priority from "./icons/Priority";

interface TicketComponentProps {
  ticket: Ticket;
  onClick?: (slug: string) => void;
}

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
        "flex flex-col gap-2 rounded-md bg-white p-2 text-sm",
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
        <span className="font-bold text-gray-400">{ticket.slug}</span>
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
          <Priority priority={ticket.priority} />
        </div>
        <div title={ticket.author.username}>
          <UserCircleIcon className="h-6 w-6 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default TicketComponent;
export { priorityNameMap, statusNameMap };

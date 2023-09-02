import cn from "clsx";
import Priority from "./icons/Priority";
import { Ticket } from "../types";
import { useDraggable } from "@dnd-kit/core";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { Bars3BottomRightIcon } from "@heroicons/react/20/solid";

interface TicketComponentProps {
  ticket: Ticket;
  onClick?: (slug: string) => void;
}

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
      <div className="flex items-center gap-1.5">
        <span className="mr-auto font-bold text-gray-600">{ticket.slug}</span>
        {ticket.comments.length > 0 && (
          <div className="[&>svg]:h-5 [&>svg]:w-5" title="Has comments">
            <Bars3BottomRightIcon />
          </div>
        )}
        <div
          className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-500"
          title={`${ticket.points} points`}
        >
          {ticket.points}
        </div>
        <div
          className="[&>svg]:h-6 [&>svg]:w-6"
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
export { priorityNameMap };

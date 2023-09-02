import { Ticket } from "../types";
import { useDraggable } from "@dnd-kit/core";
import cn from "clsx";

interface TicketComponentProps {
  ticket: Ticket;
}

const TicketComponent = ({ ticket }: TicketComponentProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: ticket.slug,
  });

  return (
    <div
      className={cn(
        "rounded-sm bg-white p-2 text-sm",
        isDragging ? "cursor-grabbing opacity-50" : "cursor-grab"
      )}
      style={{ boxShadow: "0 0 4px 0px rgba(0,0,0,15%)" }}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <div className="text-xs text-gray-500">{ticket.slug}</div>
      {ticket.title}
    </div>
  );
};

export default TicketComponent;

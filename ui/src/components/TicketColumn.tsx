import { Ticket } from "../types";
import { useDroppable } from "@dnd-kit/core";
import TicketComponent from "./Ticket";

interface TicketColumnProps {
  status: Ticket["status"];
  title: string;
  tickets: Ticket[];
  onTicketClick: (slug: string) => void;
}

const TicketColumn = ({
  status,
  title,
  tickets,
  onTicketClick,
}: TicketColumnProps) => {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div
      className="flex h-full basis-full flex-col rounded-md bg-gray-100"
      ref={setNodeRef}
    >
      <div className="space-x-2 whitespace-nowrap border-b-[1px] border-gray-200 px-4 py-2 font-semibold text-gray-600">
        <span>{title}</span>
        <span className="text-gray-300">{tickets.length}</span>
      </div>
      <div className="gap-2 space-y-2 overflow-y-scroll p-2">
        {tickets.map((ticket) => (
          <TicketComponent
            onClick={onTicketClick}
            key={ticket.slug}
            ticket={ticket}
          ></TicketComponent>
        ))}
      </div>
    </div>
  );
};

export default TicketColumn;

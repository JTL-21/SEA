import { Ticket } from "../types";
import cn from "clsx";
import { useDroppable } from "@dnd-kit/core";
import TicketComponent from "./Ticket";

interface TicketColumnProps {
  status: Ticket["status"];
  title: string;
  headerClasses?: string;
  tickets: Ticket[];
  onTicketClick: (slug: string) => void;
}

const TicketColumn = ({
  status,
  title,
  headerClasses,
  tickets,
  onTicketClick,
}: TicketColumnProps) => {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div
      className="basis-full rounded-md shadow shadow-stone-300"
      ref={setNodeRef}
    >
      <div
        className={cn(
          "whitespace-nowrap rounded-t-md px-4 py-2",
          headerClasses
        )}
      >
        {title}
      </div>
      <div className="flex flex-col gap-2 overflow-y-scroll p-2">
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

import { useParams } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import React from "react";
import { Project, Ticket } from "../types";
import API from "../api";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import TicketColumn from "../components/TicketColumn";
import TicketComponent from "../components/Ticket";

const ProjectPage = () => {
  const { key } = useParams();
  useTitle(`Project ${key}`);
  const [project, setProject] = React.useState<Project | null>(null);
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [activeTicket, setActiveTicket] = React.useState<Ticket | null>(null);

  React.useEffect(() => {
    if (!key) return;
    API.getProject(key).then((response) => {
      if (response.ok) {
        setProject(response.data);
      }
    });

    API.getProjectTickets(key).then((response) => {
      if (response.ok) {
        setTickets(response.data);
      }
    });
  }, [key]);

  const onDragStart = (event: DragStartEvent) => {
    setActiveTicket(
      tickets.find((ticket) => ticket.slug === event.active.id) ?? null
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTicket(null);
    if (!event.collisions || !event.collisions[0]) return;
    const ticketSlug = String(event.active.id);
    const newStatus = event.collisions[0].id as Ticket["status"];

    if (newStatus === activeTicket?.status) return;
    API.editTicket(ticketSlug, { status: newStatus });

    setTickets((old) =>
      old.map((ticket) => {
        if (ticket.slug !== ticketSlug) return ticket;
        return { ...ticket, status: newStatus as Ticket["status"] };
      })
    );
  };

  return (
    <div className="flex h-full flex-col">
      <h2 className="my-4 text-4xl font-semibold">
        Project {project?.key ?? key}
      </h2>
      <div className="flex h-full gap-2 pb-2 ">
        <DndContext onDragStart={onDragStart} onDragEnd={handleDragEnd}>
          <TicketColumn
            status="WAITING"
            title="Waiting"
            headerClasses="bg-gray-100 text-gray-700"
            tickets={tickets.filter((ticket) => ticket.status === "WAITING")}
          ></TicketColumn>
          <TicketColumn
            status="IN_PROGRESS"
            title="In Progress"
            headerClasses="bg-indigo-100 text-indigo-800"
            tickets={tickets.filter(
              (ticket) => ticket.status === "IN_PROGRESS"
            )}
          ></TicketColumn>
          <TicketColumn
            status="IN_TEST"
            title="In Test"
            headerClasses="bg-rose-100 text-rose-900"
            tickets={tickets.filter((ticket) => ticket.status === "IN_TEST")}
          ></TicketColumn>
          <TicketColumn
            status="DONE"
            title="Done"
            headerClasses="bg-emerald-100 text-emerald-800"
            tickets={tickets.filter((ticket) => ticket.status === "DONE")}
          ></TicketColumn>
          <DragOverlay>
            {activeTicket && (
              <div className="z-[9999]">
                <TicketComponent ticket={activeTicket} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default ProjectPage;

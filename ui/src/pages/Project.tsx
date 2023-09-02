import { useNavigate, useParams } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import React from "react";
import { Project, Ticket } from "../types";
import API from "../api";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensors,
  useSensor,
  MouseSensor,
} from "@dnd-kit/core";
import TicketColumn from "../components/TicketColumn";
import TicketComponent from "../components/Ticket";
import TicketModal from "../components/TicketModal";

const ProjectPage = () => {
  const { key, slug } = useParams();
  const navigate = useNavigate();
  useTitle(slug ? `Project ${key} - ${slug}` : `Project ${key}`);
  const [project, setProject] = React.useState<Project | null>(null);
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [activeTicket, setActiveTicket] = React.useState<Ticket | null>(null);

  const focusedTicket = tickets.find((ticket) => ticket.slug === slug);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 2,
      },
    })
  );

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

  const onTicketClick = (slug: string) => {
    if (activeTicket) return;
    navigate(`/project/${key}/${slug}`);
  };

  const refreshProject = React.useCallback(
    (refresh: "project" | "tickets" | "all" = "all") => {
      if (!key) return;
      const all = refresh === "all";

      if (all || refresh === "project") {
        console.log("Refreshing project");
        API.getProject(key).then((response) => {
          if (response.ok) {
            setProject(response.data);
          }
        });
      }

      if (all || refresh === "tickets") {
        console.log("Refreshing tickets");
        API.getProjectTickets(key).then((response) => {
          if (response.ok) {
            setTickets(response.data);
          }
        });
      }
    },
    [key]
  );

  React.useEffect(refreshProject, [key, refreshProject]);

  return (
    <div className="flex h-full flex-col">
      <h2 className="my-4 text-4xl font-semibold">
        Project {project?.key ?? key}
      </h2>
      <div className="flex gap-4">
        <DndContext
          onDragStart={onDragStart}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <TicketColumn
            status="WAITING"
            title="Waiting"
            tickets={tickets.filter((ticket) => ticket.status === "WAITING")}
            onTicketClick={onTicketClick}
          ></TicketColumn>
          <TicketColumn
            status="IN_PROGRESS"
            title="In Progress"
            tickets={tickets.filter(
              (ticket) => ticket.status === "IN_PROGRESS"
            )}
            onTicketClick={onTicketClick}
          ></TicketColumn>
          <TicketColumn
            status="IN_TEST"
            title="In Test"
            tickets={tickets.filter((ticket) => ticket.status === "IN_TEST")}
            onTicketClick={onTicketClick}
          ></TicketColumn>
          <TicketColumn
            status="DONE"
            title="Done"
            tickets={tickets.filter((ticket) => ticket.status === "DONE")}
            onTicketClick={onTicketClick}
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
      {focusedTicket && (
        <TicketModal ticket={focusedTicket} refreshProject={refreshProject} />
      )}
    </div>
  );
};

export default ProjectPage;

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
import { TrashIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/solid";
import TicketColumn from "../components/TicketColumn";
import TicketComponent from "../components/Ticket";
import TicketModal from "../components/TicketModal";
import Button from "../components/Button";
import Markdown from "../components/Markdown";

const ProjectPage = () => {
  const { key, slug } = useParams();
  useTitle(slug ? `Project ${key} - ${slug}` : `Project ${key}`);

  const navigate = useNavigate();
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
    console.log(event);
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

  const handleDeleteProject = () => {
    if (!project) return;
    API.deleteProject(project.key).then((response) => {
      if (response.ok) {
        navigate("/projects");
      }
    });
  };

  React.useEffect(refreshProject, [key, refreshProject]);

  return (
    <div className="flex h-full justify-center gap-4 pb-2">
      <div className="flex w-[200px] flex-col self-stretch lg:w-[300px] xl:w-[400px]">
        <h2 className="my-4 mr-auto text-4xl">
          <span className="mr-2 border-r-[1px] pr-2 font-semibold">
            {project?.key ?? key?.trim()}
          </span>
          <span className="text-gray-600">{project?.title}</span>
        </h2>
        <div className="flex-grow rounded-md bg-gray-100 p-4 shadow-lg ring-2 ring-black ring-opacity-5">
          <Markdown>{project?.description}</Markdown>
        </div>
      </div>
      <div className="flex h-full max-w-[1200px] flex-grow flex-col">
        <div className="my-4 ml-auto flex items-end gap-2">
          <Button
            className="bg-emerald-400 hover:bg-emerald-500"
            icon={<PlusIcon />}
          >
            Add Ticket
          </Button>
          <Button
            className="bg-blue-400 hover:bg-blue-500"
            icon={<PencilIcon />}
          >
            Edit Project
          </Button>
          <Button
            className="bg-red-400 hover:bg-red-500"
            confirmClasses="text-rose-50"
            icon={<TrashIcon />}
            requireConfirmation
            onClick={handleDeleteProject}
          >
            Delete Project
          </Button>
        </div>
        <div className="flex flex-1 gap-4 overflow-hidden">
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
    </div>
  );
};

export default ProjectPage;

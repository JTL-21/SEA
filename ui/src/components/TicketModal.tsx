import { Link, useNavigate } from "react-router-dom";
import { Ticket } from "../types";
import Markdown from "./Markdown";
import { priorityIconMap, priorityNameMap } from "./Ticket";
import AccountCircleIcon from "./icons/AccountCircleIcon";
import Close from "./icons/Close";
import Edit from "./icons/Edit";
import Time from "./icons/Time";
import Delete from "./icons/Delete";
import Assign from "./icons/Assign";
import React from "react";
import cn from "clsx";
import API from "../api";

interface TicketModalProps {
  ticket: Ticket;
}

interface UserLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  children: string;
}

const UserLink = ({ children, className, ...aProps }: UserLinkProps) => (
  <Link
    to={`/account/${children}`}
    className={cn(className, "underline")}
    {...aProps}
  >
    {children}
  </Link>
);

interface ModalDataProps {
  icon: React.ReactNode;
  children?: React.ReactNode;
}

const ModalData = ({ icon, children }: ModalDataProps) => {
  return (
    <div className="flex items-center gap-2 rounded-md bg-white p-2">
      <div className="[&>svg]:h-6 [&>svg]:w-6">{icon}</div>
      {children}
    </div>
  );
};

interface ModalButtonProps extends ModalDataProps {
  onClick?: () => void;
}

const ModalButton = ({ icon, children, onClick }: ModalButtonProps) => {
  return (
    <button
      className="flex items-center gap-2 rounded-md bg-white p-2 filter hover:bg-gray-100 active:brightness-95"
      onClick={onClick}
    >
      <div className="[&>svg]:h-6 [&>svg]:w-6">{icon}</div>
      {children}
    </button>
  );
};

interface ModalGroupProps {
  children?: React.ReactNode;
}

const ModalGroup = ({ children }: ModalGroupProps) => {
  return <div className="flex flex-col p-2">{children}</div>;
};

const ModalGroupDivider = () => (
  <div className="h-[1px] w-full bg-gray-200"></div>
);

const TicketModal = ({ ticket }: TicketModalProps) => {
  const navigate = useNavigate();

  const handleModalClose = () => navigate(`/project/${ticket.project.key}`);

  const handleDeleteTicket = () => {
    API.deleteTicket(ticket.slug).then((response) => {
      if (response.ok) {
        handleModalClose();
      }
    });
  };

  const date = new Date(ticket.created_at);

  return (
    <div
      className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-gray-600 bg-opacity-50 p-2"
      onClick={handleModalClose}
    >
      <div
        className="flex w-[800px] flex-col rounded-md bg-white text-gray-600 shadow"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-stretch gap-2 border-b-[1px]">
          <div className="flex items-center pl-4 text-xl">
            <span className="font-semibold text-gray-400">{ticket.slug}</span>
          </div>
          <div className="flex flex-grow items-center">
            <h3 className="text-xl">{ticket.title}</h3>
          </div>
          <div className="aspect-square border-l-[1px]">
            <button
              className="grid h-full w-full place-content-center p-2 hover:drop-shadow"
              onClick={handleModalClose}
            >
              <Close className="h-10 w-10" />
            </button>
          </div>
        </div>

        <div className="flex flex-grow">
          <div className="flex flex-grow basis-2/3 flex-col p-4">
            <h4 className="text-xl font-semibold">Description</h4>
            <Markdown>{ticket.description}</Markdown>
          </div>
          <div className="basis-1/3 flex-col border-l-[1px] text-sm">
            <ModalGroup>
              <ModalData icon={priorityIconMap[ticket.priority]}>
                {priorityNameMap[ticket.priority]} Priority
              </ModalData>
              <ModalData
                icon={
                  <div className="grid h-6 w-6 place-content-center rounded-full bg-stone-100 font-semibold text-stone-600 shadow">
                    {ticket.points}
                  </div>
                }
              >
                Story Points
              </ModalData>
              <ModalData icon={<AccountCircleIcon />}>
                <span>
                  Assigned to{" "}
                  {ticket.assignee ? (
                    <UserLink>{ticket.assignee.username}</UserLink>
                  ) : (
                    "Nobody"
                  )}
                </span>
              </ModalData>
            </ModalGroup>
            <ModalGroupDivider />
            <ModalGroup>
              <ModalButton icon={<Edit />}>Edit</ModalButton>
              <ModalButton icon={<Delete />} onClick={handleDeleteTicket}>
                Delete
              </ModalButton>
              <ModalButton icon={<Assign />}>Assign</ModalButton>
            </ModalGroup>
            <ModalGroupDivider />
            <ModalGroup>
              <ModalData icon={<Time />}>
                {date.toLocaleDateString()} {date.toLocaleTimeString()}
              </ModalData>
              <ModalData icon={<AccountCircleIcon />}>
                <span>
                  Created by <UserLink>{ticket.author.username}</UserLink>
                </span>
              </ModalData>
            </ModalGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;

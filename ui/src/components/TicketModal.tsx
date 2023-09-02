import { useNavigate } from "react-router-dom";
import { Ticket, User } from "../types";
import Markdown from "./Markdown";
import { priorityNameMap } from "./Ticket";
import {
  XMarkIcon,
  TrashIcon,
  TagIcon,
  PencilIcon,
  ClockIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import React from "react";
import cn from "clsx";
import Button, { Props as ButtonProps } from "./Button";
import API from "../api";
import { formatDateTime } from "../utils/time";
import { Dialog, Popover } from "@headlessui/react";
import CommentColumn from "./CommentColumn";
import UserSearch from "./UserSearch";
import Priority from "./icons/Priority";
import ModalOverlay from "./ModelOverlay";
import Username from "./Username";

interface TicketModalProps {
  ticket: Ticket;
  refreshProject: (refresh?: "project" | "tickets" | "all") => void;
}

interface ModalDataProps extends React.ComponentPropsWithoutRef<"div"> {
  icon: React.ReactNode;
}

const ModalData = ({
  icon,
  children,
  className,
  ...divProps
}: ModalDataProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md bg-white p-2 [&>svg]:h-6 [&>svg]:w-6",
        className
      )}
      {...divProps}
    >
      {icon}
      {children}
    </div>
  );
};

interface ModalButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  icon: React.ReactNode;
  requireConfirmation?: boolean;
  onClick?: () => void;
  as?: ButtonProps["as"];
}

const ModalButton = React.forwardRef<HTMLElement, ModalButtonProps>(
  (
    {
      icon,
      children,
      className,
      requireConfirmation = false,
      onClick,
      as = "button",
      ...buttonProps
    },
    ref
  ) => {
    return (
      <Button
        className={cn(
          "flex items-center gap-2 rounded-md bg-white p-2 filter hover:bg-gray-100 active:brightness-95",
          className
        )}
        onClick={onClick}
        styled={false}
        centered={false}
        requireConfirmation={requireConfirmation}
        icon={icon}
        as={as}
        ref={ref}
        {...buttonProps}
      >
        {children}
      </Button>
    );
  }
);

interface ModalGroupProps {
  children?: React.ReactNode;
}

const ModalGroup = ({ children }: ModalGroupProps) => {
  return <div className="flex flex-col p-2">{children}</div>;
};

const ModalGroupDivider = () => (
  <div className="h-[1px] w-full bg-gray-200"></div>
);

const TicketModal = ({ ticket, refreshProject }: TicketModalProps) => {
  const navigate = useNavigate();

  const handleModalClose = () => navigate(`/project/${ticket.project.key}`);
  const assignUserButtonRef = React.useRef<HTMLElement | null>(null);

  const handleDeleteTicket = () => {
    API.deleteTicket(ticket.slug).then((response) => {
      if (response.ok) {
        refreshProject("tickets");
        handleModalClose();
      }
    });
  };

  const handleAssignUser = (user: User) => {
    assignUserButtonRef.current?.click();
    API.editTicket(ticket.slug, { assignee: user.username }).then(
      (response) => {
        if (response.ok) {
          console.log(`Assigned ${ticket.slug} to ${user.username}`);
          refreshProject("tickets");
        } else {
          console.log(
            `Failed to assign ${ticket.slug} to ${user.username}: ${response.error}`
          );
        }
      }
    );
  };

  const date = new Date(ticket.created_at);

  return (
    <Dialog
      open={true}
      onClose={handleModalClose}
      className="fixed inset-0 grid place-content-center p-2"
    >
      <ModalOverlay />

      <Dialog.Panel
        as="div"
        className="relative flex min-h-[550px] max-w-[1400px] flex-col rounded-md bg-white text-gray-600 shadow-2xl ring-1 ring-black ring-opacity-5"
      >
        <div className="flex items-stretch gap-2 border-b-[1px] text-2xl">
          <div className="flex items-center pl-4 ">
            <span className="font-semibold text-gray-500">{ticket.slug}</span>
          </div>
          <div className="flex flex-grow items-center">
            <h3>{ticket.title}</h3>
          </div>
          <div className="aspect-square border-l-[1px]">
            <button
              className="grid h-full w-full place-content-center rounded-tr-md bg-white p-2 hover:bg-gray-100"
              onClick={handleModalClose}
            >
              <XMarkIcon className="h-10 w-10" />
            </button>
          </div>
        </div>
        <div className="flex flex-grow">
          <div className="flex max-h-[600px] flex-grow basis-2/4 flex-col overflow-y-scroll px-4 py-2">
            <h4 className="text-xl font-semibold">Description</h4>
            <Markdown>{ticket.description}</Markdown>
          </div>
          <div className="flex max-h-[600px] flex-grow basis-1/4 flex-col border-l-[1px] pt-2">
            <h4 className="ml-4 text-xl font-semibold">Comments</h4>
            <CommentColumn ticket={ticket} />
          </div>
          <div className="max-w-[250px] basis-1/4 flex-col border-l-[1px] text-sm">
            <ModalGroup>
              <ModalData icon={<Priority priority={ticket.priority} />}>
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
              <ModalData icon={<UserCircleIcon />} className="relative">
                <div className="flex space-x-1">
                  Assigned to{" "}
                  {ticket.assignee ? (
                    <Username user={ticket.assignee} icons={false} />
                  ) : (
                    "Nobody"
                  )}
                </div>
              </ModalData>
            </ModalGroup>
            <ModalGroupDivider />
            <ModalGroup>
              <ModalButton icon={<PencilIcon />}>Edit</ModalButton>
              <ModalButton
                icon={<TrashIcon />}
                onClick={handleDeleteTicket}
                requireConfirmation={true}
              >
                Delete
              </ModalButton>
              <Popover className="relative">
                <ModalButton
                  icon={<TagIcon />}
                  as={Popover.Button}
                  className="w-full"
                  ref={assignUserButtonRef}
                >
                  Assign
                </ModalButton>
                <Popover.Panel className="absolute top-full z-10">
                  <UserSearch onChange={handleAssignUser} />
                </Popover.Panel>
              </Popover>
            </ModalGroup>
            <ModalGroupDivider />
            <ModalGroup>
              <ModalData icon={<ClockIcon />}>{formatDateTime(date)}</ModalData>
              <ModalData icon={<UserCircleIcon />}>
                <div className="flex space-x-1">
                  Added by <Username user={ticket.author} icons={false} />
                </div>
              </ModalData>
            </ModalGroup>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default TicketModal;

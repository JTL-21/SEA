import Markdown from "./Markdown";
import React from "react";
import cn from "clsx";
import Button from "./Button";
import CommentColumn from "./CommentColumn";
import UserSearch from "./UserSearch";
import Priority from "./icons/Priority";
import Username from "./Username";
import API from "../api";
import {
  TrashIcon,
  TagIcon,
  PencilIcon,
  ClockIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { priorityNameMap } from "./Ticket";
import { formatDateTime } from "../utils/time";
import { Popover } from "@headlessui/react";
import { Ticket, User } from "../types";
import { TicketModalProps } from "./TicketModal";

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

interface ModalButtonProps extends React.ComponentPropsWithRef<"button"> {
  icon: React.ReactNode;
  requireConfirmation?: boolean;
  onClick?: () => void;
  isPopoverButton?: boolean;
}

const ModalButton = React.forwardRef<HTMLButtonElement, ModalButtonProps>(
  (
    {
      icon,
      children,
      className,
      requireConfirmation = false,
      onClick,
      isPopoverButton = false,
      ...buttonProps
    },
    ref
  ) => {
    const Component = isPopoverButton ? Popover.Button : "button";

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
        ref={ref}
        {...buttonProps}
        as={Component}
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

interface TicketViewModalProps {
  ticket: Ticket;
  onEdit: () => void;
  refresh: TicketModalProps["refresh"];
  onClose: () => void;
}

const TicketViewModal = ({
  ticket,
  onEdit,
  refresh,
  onClose,
}: TicketViewModalProps) => {
  const date = new Date(ticket.created_at);
  const assignUserButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleDeleteTicket = () => {
    API.deleteTicket(ticket.slug).then((response) => {
      if (response.ok) {
        refresh("tickets");
        onClose();
      }
    });
  };

  const handleAssignUser = (user: User) => {
    assignUserButtonRef.current?.click();
    API.editTicket(ticket.slug, { assignee: user.username }).then(
      (response) => {
        if (response.ok) {
          refresh("tickets");
        } else {
          console.log(
            `Failed to assign ${ticket.slug} to ${user.username}: ${response.error}`
          );
        }
      }
    );
  };

  return (
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
          <ModalButton icon={<PencilIcon />} onClick={onEdit}>
            Edit
          </ModalButton>
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
              isPopoverButton={true}
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
  );
};

export default TicketViewModal;

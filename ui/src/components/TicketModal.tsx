import React from "react";
import ModalOverlay from "./ModelOverlay";
import TicketEditorModal from "./TicketEditorModal";
import TicketViewModal from "./TicketViewModal";
import API from "../api";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { Project, Ticket } from "../types";
import { Dialog } from "@headlessui/react";

type RefreshFunction = (refresh?: "project" | "tickets" | "all") => void;

type TicketModalModeProps = { mode: "edit"; ticket: Ticket } | { mode: "add" };
type TicketModalBaseProps = {
  refresh: RefreshFunction;
  project: Pick<Project, "key">;
};
type TicketModalProps = TicketModalBaseProps & TicketModalModeProps;

const BLANK_TICKET = {
  title: "",
  description: "",
  priority: "MEDIUM",
  points: 1,
} as const;

const TicketModal = (props: TicketModalProps) => {
  const navigate = useNavigate();
  const [editing, setEditing] = React.useState(false);
  const [formError, setFormError] = React.useState<string | undefined>(
    undefined
  );

  const isEditing = props.mode === "edit";
  const isAdding = !isEditing;

  const closeModal = () => navigate(`/project/${props.project.key}`);

  const handleFinishEditing = (
    data: Pick<Ticket, "title" | "description" | "priority" | "points">
  ) => {
    if (isEditing) {
      API.editTicket(props.ticket.slug, {
        ...data,
        points: Number(data.points),
      }).then((response) => {
        if (response.ok) {
          setEditing(false);
          props.refresh("tickets");
        } else {
          setFormError(response.error.message);
        }
      });
    } else {
      API.createTicket({
        project: props.project.key,
        ...data,
        points: Number(data.points),
      }).then((response) => {
        if (response.ok) {
          closeModal();
          props.refresh("tickets");
        } else {
          setFormError(response.error.message);
        }
      });
    }
  };

  return (
    <Dialog
      open={true}
      onClose={closeModal}
      className="fixed inset-0 grid place-content-center p-2"
    >
      <ModalOverlay />

      <Dialog.Panel
        as="div"
        className="relative flex min-h-[500px] w-[90vw] max-w-[1200px] flex-col rounded-md bg-white text-gray-600 shadow-2xl ring-1 ring-black ring-opacity-5"
      >
        <div className="flex items-stretch gap-2 border-b-[1px] pl-4 text-2xl">
          {isEditing && (
            <div className="flex items-center">
              <span className="font-semibold text-gray-500">
                {props.ticket.slug}
              </span>
            </div>
          )}
          <div className="flex flex-grow items-center">
            <h3>
              {isEditing
                ? props.ticket.title
                : `Add Ticket to ${props.project.key}`}
            </h3>
          </div>
          <div className="aspect-square border-l-[1px]">
            <button
              className="grid h-full w-full place-content-center rounded-tr-md bg-white p-2 hover:bg-gray-100"
              onClick={closeModal}
            >
              <XMarkIcon className="h-10 w-10" />
            </button>
          </div>
        </div>
        {editing || isAdding ? (
          <TicketEditorModal
            ticket={isEditing ? props.ticket : BLANK_TICKET}
            onSubmit={handleFinishEditing}
            onCancel={closeModal}
            mode={isEditing ? "edit" : "add"}
            formError={formError}
          />
        ) : (
          <TicketViewModal
            ticket={props.ticket}
            refresh={props.refresh}
            onEdit={() => setEditing(true)}
            onClose={closeModal}
          />
        )}
      </Dialog.Panel>
    </Dialog>
  );
};

export default TicketModal;
export type { TicketModalProps };

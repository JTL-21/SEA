import React from "react";
import TicketEditorModal from "./TicketEditorModal";
import TicketViewModal from "./TicketViewModal";
import API from "../api";
import Modal from "./Modal";
import { Project, Ticket } from "../types";

type RefreshFunction = (refresh?: "project" | "tickets" | "all") => void;

type TicketModalModeProps = { mode: "edit"; ticket: Ticket } | { mode: "add" };
type TicketModalBaseProps = {
  refresh: RefreshFunction;
  project: Pick<Project, "key">;
  onClose: () => void;
};
type TicketModalProps = TicketModalBaseProps & TicketModalModeProps;

const BLANK_TICKET = {
  title: "",
  description: "",
  priority: "MEDIUM",
  points: 1,
} as const;

const TicketModal = (props: TicketModalProps) => {
  const [editing, setEditing] = React.useState(false);
  const [formError, setFormError] = React.useState<string | undefined>(
    undefined
  );

  const isEditing = props.mode === "edit";
  const isAdding = !isEditing;

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
          props.onClose();
          props.refresh("tickets");
        } else {
          setFormError(response.error.message);
        }
      });
    }
  };

  const ModalTitle = (
    <>
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
    </>
  );

  return (
    <Modal open={true} onClose={props.onClose} title={ModalTitle}>
      {editing || isAdding ? (
        <TicketEditorModal
          ticket={isEditing ? props.ticket : BLANK_TICKET}
          onSubmit={handleFinishEditing}
          onCancel={props.onClose}
          mode={isEditing ? "edit" : "add"}
          formError={formError}
        />
      ) : (
        <TicketViewModal
          ticket={props.ticket}
          refresh={props.refresh}
          onEdit={() => setEditing(true)}
          onClose={props.onClose}
        />
      )}
    </Modal>
  );
};

export default TicketModal;
export type { TicketModalProps };

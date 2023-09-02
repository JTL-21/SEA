import React from "react";
import ModalOverlay from "./ModelOverlay";
import TicketEditModal from "./TicketEditModal";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { Ticket } from "../types";
import { Dialog } from "@headlessui/react";
import TicketViewModal from "./TicketViewModal";

interface TicketModalProps {
  ticket: Ticket;
  refresh: (refresh?: "project" | "tickets" | "all") => void;
}

const TicketModal = ({ ticket, refresh }: TicketModalProps) => {
  const navigate = useNavigate();
  const [editing, setEditing] = React.useState(false);

  const handleModalClose = () => navigate(`/project/${ticket.project.key}`);

  const handleFinishEditing = () => {
    setEditing(false);
    refresh("tickets");
  };

  return (
    <Dialog
      open={true}
      onClose={handleModalClose}
      className="fixed inset-0 grid place-content-center p-2"
    >
      <ModalOverlay />

      <Dialog.Panel
        as="div"
        className="relative flex min-h-[500px] w-[90vw] max-w-[1200px] flex-col rounded-md bg-white text-gray-600 shadow-2xl ring-1 ring-black ring-opacity-5"
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
        {editing ? (
          <TicketEditModal ticket={ticket} onFinish={handleFinishEditing} />
        ) : (
          <TicketViewModal
            ticket={ticket}
            refresh={refresh}
            onEdit={() => setEditing(true)}
            onClose={handleModalClose}
          />
        )}
      </Dialog.Panel>
    </Dialog>
  );
};

export default TicketModal;
export type { TicketModalProps };

import React from "react";
import { Ticket } from "../types";
import useUser from "../hooks/useUser";
import API from "../api";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import TicketComponent from "../components/Ticket";
import TicketModal from "../components/TicketModal";

const Assigned = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { slug } = useParams();
  const [tickets, setTickets] = React.useState<Ticket[]>([]);

  const focusedTicket = slug
    ? tickets.find((ticket) => ticket.slug === slug)
    : undefined;

  const refreshTickets = React.useCallback(
    (assignee: string) =>
      API.queryTickets({ assignee }).then((response) => {
        if (response.ok) {
          setTickets(response.data);
        } else {
          toast.error("Failed to get assigned work");
        }
      }),
    []
  );

  const handleRefreshTickets = () => {
    if (!user) return;
    refreshTickets(user.username);
  };

  const handleCloseModal = () => {
    navigate("/assigned");
  };

  React.useEffect(() => {
    if (!user) return;

    refreshTickets(user.username);
  }, [user, refreshTickets]);

  return (
    <>
      <div className="mx-auto max-w-[1200px] px-2 py-4">
        <h2 className="text-3xl font-semibold">Assigned to Me</h2>
        <div className="grid grid-cols-2 gap-2 py-4 sm:grid-cols-3 lg:grid-cols-4">
          {tickets.map((ticket) => (
            <Link to={`/assigned/${ticket.slug}`} className="[&>div]:h-full">
              <TicketComponent key={ticket.slug} ticket={ticket} />
            </Link>
          ))}
        </div>
      </div>
      {focusedTicket && (
        <TicketModal
          ticket={focusedTicket}
          refresh={handleRefreshTickets}
          mode="edit"
          project={{ key: focusedTicket.project.key }}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Assigned;

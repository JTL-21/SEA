import { TICKET_PRIORITIES, Ticket } from "../types";

const getNumericalPriority = (priority: Ticket["priority"]) =>
  TICKET_PRIORITIES.indexOf(priority);

// Sorts tickets first based on priority and then by points
const sortTickets = (tickets: Ticket[]) =>
  tickets.sort((a, b) => {
    if (a.priority !== b.priority) {
      return (
        getNumericalPriority(b.priority) - getNumericalPriority(a.priority)
      );
    }

    return b.points - a.points;
  });

export { getNumericalPriority, sortTickets };

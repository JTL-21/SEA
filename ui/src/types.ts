interface User {
  username: string;
  is_admin: boolean;
  created_at: string;
}

interface Project {
  key: string;
  title: string;
  description: string;
  owner: User;
  created_at: string;
  ticket_count: number;
}

const TICKET_STATUSES = ["WAITING", "IN_PROGRESS", "IN_TEST", "DONE"] as const;
const TICKET_PRIORITIES = [
  "VERY_LOW",
  "LOW",
  "MEDIUM",
  "HIGH",
  "VERY_HIGH",
] as const;

interface Ticket {
  id: number;
  project: Project;
  title: string;
  description: string;
  status: (typeof TICKET_STATUSES)[number];
  author: User;
  slug: string;
  created_at: string;
  points: number;
  priority: (typeof TICKET_PRIORITIES)[number];
  assignee?: User;
  comments: Comment[];
}

interface Comment {
  id: number;
  text: string;
  author: User;
  created_at: Date;
}

interface CreateUserBody {
  username: User["username"];
  password: string;
}

interface CreateProjectBody {
  key: Project["key"];
  title: Project["title"];
  description?: Project["description"];
}

interface EditProjectBody {
  title?: Project["title"];
  description?: Project["description"];
}

interface CreateTicketBody {
  project: Project["key"];
  title: Ticket["title"];
  description?: Ticket["description"];
}

interface EditTicketBody {
  title?: Ticket["title"];
  description?: Ticket["description"];
  status?: Ticket["status"];
  assignee?: User["username"];
}

interface CreateCommentBody {
  text: Comment["text"];
}

interface LogInBody {
  username: User["username"];
  password: string;
  stay_signed_in: boolean;
}

interface APIError {
  message: string;
}

type APIResponse<TResponse> =
  | { ok: true; err: false; data: TResponse }
  | { ok: false; err: true; error: APIError };

export { TICKET_PRIORITIES, TICKET_STATUSES };
export type {
  CreateUserBody,
  CreateProjectBody,
  EditProjectBody,
  CreateTicketBody,
  EditTicketBody,
  CreateCommentBody,
  LogInBody,
  APIError,
  APIResponse,
  Project,
  Ticket,
  Comment,
  User,
};

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
}

interface Comment {
  id: number;
  text: string;
  author: User;
  created_at: Date;
}

interface CreateUserBody {
  username: string;
  password: string;
}

interface CreateProjectBody {
  key: string;
  title: string;
  description?: string;
}

interface EditProjectBody {
  title?: string;
  description?: string;
}

interface CreateTicketBody {
  project: string;
  title: string;
  description?: string;
}

interface EditTicketBody {
  title?: string;
  description?: string;
  status?: Ticket["status"];
}

interface CreateCommentBody {
  text: string;
}

interface LogInBody {
  username: string;
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

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

interface Ticket {
  id: number;
  project: Project;
  title: string;
  description: string;
  status: "WAITING" | "IN_PROGRESS" | "IN_TEST" | "DONE";
  author: User;
  slug: string;
  created_at: string;
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

interface APIError {
  message: string;
}

type APIResponse<TResponse> =
  | { ok: true; err: false; data: TResponse }
  | { ok: false; err: true; error: APIError };

export type {
  CreateUserBody,
  CreateProjectBody,
  EditProjectBody,
  CreateTicketBody,
  EditTicketBody,
  CreateCommentBody,
  APIError,
  APIResponse,
  Project,
  Ticket,
  Comment,
  User,
};

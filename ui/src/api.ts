import {
  CreateUserBody,
  CreateProjectBody,
  EditProjectBody,
  CreateTicketBody,
  EditTicketBody,
  CreateCommentBody,
  APIResponse,
  User,
  Project,
  Ticket,
  Comment,
  LogInBody,
} from "./types";

const { VITE_API_URL } = import.meta.env;

const JSONHeaders = { "Content-Type": "application/json" };

const APIFetch = async <TResponse>(
  ...args: Parameters<typeof fetch>
): Promise<APIResponse<TResponse>> => {
  let response: Response;
  try {
    response = await fetch(args[0], { credentials: "include", ...args[1] });
  } catch (error) {
    console.error(error);
    return { ok: false, err: true, error: { message: "Network Error" } };
  }

  let data: any;
  if (
    response.status !== 201 &&
    response.status !== 204 &&
    response.status !== 205
  ) {
    data = await response.json();
  }

  if (response.ok) {
    return { ok: true, err: false, data };
  } else {
    return { ok: false, err: true, error: data };
  }
};

const getUser = (username: string) =>
  APIFetch<User>(`${VITE_API_URL}/api/user/${username}`);

const createUser = (body: CreateUserBody) =>
  APIFetch<User>(`${VITE_API_URL}/api/user`, {
    method: "POST",
    headers: JSONHeaders,
    body: JSON.stringify(body),
  });

const queryUsers = (username: string) => {
  const query = new URLSearchParams({ username }).toString();
  return APIFetch<User[]>(`${VITE_API_URL}/api/user?${query}`);
};

const login = (body: LogInBody) =>
  APIFetch<User>(`${VITE_API_URL}/api/login`, {
    method: "POST",
    headers: JSONHeaders,
    body: JSON.stringify(body),
  });

const logout = () =>
  APIFetch<never>(`${VITE_API_URL}/api/logout`, {
    method: "POST",
  });

const whoami = () => APIFetch<User>(`${VITE_API_URL}/api/whoami`);

const createProject = (body: CreateProjectBody) =>
  APIFetch<Project>(`${VITE_API_URL}/api/project`, {
    method: "POST",
    headers: JSONHeaders,
    body: JSON.stringify(body),
  });

const getProject = (key: string) =>
  APIFetch<Project>(`${VITE_API_URL}/api/project/${key}`);

const editProject = (key: string, body: EditProjectBody) =>
  APIFetch<Project>(`${VITE_API_URL}/api/project/${key}`, {
    method: "PATCH",
    headers: JSONHeaders,
    body: JSON.stringify(body),
  });

const getAllProjects = () => APIFetch<Project[]>(`${VITE_API_URL}/api/project`);

const getProjectTickets = (key: string) =>
  APIFetch<Ticket[]>(`${VITE_API_URL}/api/project/${key}/tickets`);

const createTicket = (body: CreateTicketBody) =>
  APIFetch<Ticket>(`${VITE_API_URL}/api/ticket`, {
    method: "POST",
    headers: JSONHeaders,
    body: JSON.stringify(body),
  });

const getTicket = (slug: string) =>
  APIFetch<Ticket>(`${VITE_API_URL}/api/ticket/${slug}`);

const editTicket = (slug: string, body: EditTicketBody) =>
  APIFetch<Ticket>(`${VITE_API_URL}/api/ticket/${slug}`, {
    method: "PATCH",
    headers: JSONHeaders,
    body: JSON.stringify(body),
  });

const deleteTicket = (slug: string) =>
  APIFetch<"">(`${VITE_API_URL}/api/ticket/${slug}`, {
    method: "DELETE",
  });

const getTicketComments = (slug: string) =>
  APIFetch<Comment[]>(`${VITE_API_URL}/api/ticket/${slug}/comments`);

const createComment = (slug: string, body: CreateCommentBody) =>
  APIFetch<Comment>(`${VITE_API_URL}/api/ticket/${slug}/comment`, {
    method: "POST",
    headers: JSONHeaders,
    body: JSON.stringify(body),
  });

const deleteComment = (id: string | number) =>
  APIFetch<"">(`${VITE_API_URL}/api/comment/${id}`, {
    method: "DELETE",
  });

const user = { getUser, createUser, queryUsers, login, logout, whoami };

const project = {
  createProject,
  getProject,
  editProject,
  getAllProjects,
  getProjectTickets,
};

const ticket = {
  createTicket,
  getTicket,
  editTicket,
  deleteTicket,
  getTicketComments,
};

const comment = {
  createComment,
  deleteComment,
};

export default { ...user, ...project, ...ticket, ...comment };
export { user, project, ticket, comment };

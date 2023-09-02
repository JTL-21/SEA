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
} from "./types";

const { VITE_API_URL } = import.meta.env;

const JSONHeaders = { "Content-Type": "application/json" };

const APIFetch = async <TResponse>(
  fetchResponse: Promise<Response>
): Promise<APIResponse<TResponse>> => {
  let response: Response;
  try {
    response = await fetchResponse;
  } catch (error) {
    console.error(error);
    return { ok: false, err: true, error: { message: "Network Error" } };
  }

  const json = await response.json();

  if (response.ok) {
    return { ok: true, err: false, data: json };
  } else {
    return { ok: false, err: true, error: json };
  }
};

const getUser = (username: string) =>
  APIFetch<User>(fetch(`${VITE_API_URL}/api/user/${username}`));

const createUser = (body: CreateUserBody) =>
  APIFetch<User>(
    fetch(`${VITE_API_URL}/api/user`, {
      method: "POST",
      headers: JSONHeaders,
      body: JSON.stringify(body),
    })
  );

const queryUsers = (username: string) => {
  const query = new URLSearchParams({ username }).toString();
  return APIFetch<User[]>(fetch(`${VITE_API_URL}/api/user?${query}`));
};

const createProject = (body: CreateProjectBody) =>
  APIFetch<Project>(
    fetch(`${VITE_API_URL}/api/project`, {
      method: "POST",
      headers: JSONHeaders,
      body: JSON.stringify(body),
    })
  );

const getProject = (key: string) =>
  APIFetch<Project>(fetch(`${VITE_API_URL}/api/project/${key}`));

const editProject = (key: string, body: EditProjectBody) =>
  APIFetch<Project>(
    fetch(`${VITE_API_URL}/api/project/${key}`, {
      method: "PATCH",
      headers: JSONHeaders,
      body: JSON.stringify(body),
    })
  );

const getAllProjects = () =>
  APIFetch<Project[]>(fetch(`${VITE_API_URL}/api/project`));

const getProjectTickets = (key: string) =>
  APIFetch<Ticket[]>(fetch(`${VITE_API_URL}/api/project/${key}/tickets`));

const createTicket = (body: CreateTicketBody) =>
  APIFetch<Ticket>(
    fetch(`${VITE_API_URL}/api/ticket`, {
      method: "POST",
      headers: JSONHeaders,
      body: JSON.stringify(body),
    })
  );

const getTicket = (slug: string) =>
  APIFetch<Ticket>(fetch(`${VITE_API_URL}/api/ticket/${slug}`));

const editTicket = (slug: string, body: EditTicketBody) =>
  APIFetch<Ticket>(
    fetch(`${VITE_API_URL}/api/ticket/${slug}`, {
      method: "PATCH",
      headers: JSONHeaders,
      body: JSON.stringify(body),
    })
  );

const deleteTicket = (slug: string) =>
  APIFetch<"">(
    fetch(`${VITE_API_URL}/api/ticket/${slug}`, {
      method: "DELETE",
    })
  );

const getTicketComments = (slug: string) =>
  APIFetch<Comment[]>(fetch(`${VITE_API_URL}/api/ticket/${slug}/comments`));

const createComment = (slug: string, body: CreateCommentBody) =>
  APIFetch<Comment>(
    fetch(`${VITE_API_URL}/api/ticket/${slug}/comment`, {
      method: "POST",
      headers: JSONHeaders,
      body: JSON.stringify(body),
    })
  );

const deleteComment = (id: string | number) =>
  APIFetch<"">(
    fetch(`${VITE_API_URL}/api/comment/${id}`, {
      method: "DELETE",
    })
  );

const user = { getUser, createUser, queryUsers };

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

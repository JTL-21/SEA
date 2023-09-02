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
import { wait } from "./utils/time";

const { VITE_API_URL } = import.meta.env;

const ARTIFICIAL_LATENCY = 0;
const ARTIFICIAL_LATENCY_DEVIATION = 0;

const prefixURL = (url: string) => {
  if (url.startsWith("http")) {
    return url;
  } else {
    return `${VITE_API_URL}${url}`;
  }
};

const serializeBody = (
  body: string | object | undefined
): string | undefined => {
  switch (typeof body) {
    case "string": {
      return body;
    }
    case "object": {
      return JSON.stringify(body);
    }
    default: {
      return undefined;
    }
  }
};

const APIFetch = async <TResponse>(
  url: string,
  config?: Omit<RequestInit, "body"> & {
    body?: string | object;
  }
): Promise<APIResponse<TResponse>> => {
  let response: Response;
  try {
    ARTIFICIAL_LATENCY > 0 &&
      (await wait(
        ARTIFICIAL_LATENCY +
          Math.random() * ARTIFICIAL_LATENCY_DEVIATION * 2 -
          ARTIFICIAL_LATENCY_DEVIATION
      ));
    response = await fetch(prefixURL(url), {
      credentials: "include", // Include credentials by default
      ...config,
      headers: {
        // Set content type to json if body is present
        ...(config?.body && { "Content-Type": "application/json" }),
        ...config?.headers, // Overwrite with passed headers
      },
      body: serializeBody(config?.body),
    });
  } catch (error) {
    console.error(error);
    return { ok: false, err: true, error: { message: "Network Error" } };
  }

  let data;
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

const APIFetchMethodFactory =
  (method: RequestInit["method"]) =>
  <TResponse>(...args: Parameters<typeof APIFetch>) =>
    APIFetch<TResponse>(args[0], { ...args[1], method: method });

APIFetch.get = APIFetchMethodFactory("GET");
APIFetch.post = APIFetchMethodFactory("POST");
APIFetch.put = APIFetchMethodFactory("PUT");
APIFetch.patch = APIFetchMethodFactory("PATCH");
APIFetch.delete = APIFetchMethodFactory("DELETE");

const getUser = (username: string) =>
  APIFetch.get<User>(`/api/user/${username}`);

const createUser = (body: CreateUserBody) =>
  APIFetch.post<User>("/api/user", {
    body: body,
  });

const queryUsers = (username: string) => {
  const query = new URLSearchParams({ username }).toString();
  return APIFetch.get<User[]>(`/api/user?${query}`);
};

const login = (body: LogInBody) =>
  APIFetch.post<User>("/api/login", {
    body: body,
  });

const logout = () => APIFetch.post<never>("/api/logout");

const whoami = () => APIFetch.get<User>("/api/whoami");

const createProject = (body: CreateProjectBody) =>
  APIFetch.post<Project>("/api/project", {
    body: body,
  });

const getProject = (key: string) =>
  APIFetch.get<Project>(`/api/project/${key}`);

const editProject = (key: string, body: EditProjectBody) =>
  APIFetch.patch<Project>(`/api/project/${key}`, {
    body: body,
  });

const deleteProject = (key: string) => APIFetch.delete(`/api/project/${key}`);

const queryProjects = (query: string) => {
  const queryString = new URLSearchParams({ query }).toString();
  return APIFetch.get<Project[]>(`/api/project?${queryString}`);
};

const getProjectTickets = (key: string) =>
  APIFetch.get<Ticket[]>(`/api/project/${key}/tickets`);

const createTicket = (body: CreateTicketBody) =>
  APIFetch.post<Ticket>("/api/ticket", {
    body: body,
  });

const getTicket = (slug: string) => APIFetch.get<Ticket>(`/api/ticket/${slug}`);

const editTicket = (slug: string, body: EditTicketBody) =>
  APIFetch.patch<Ticket>(`/api/ticket/${slug}`, {
    body: body,
  });

const deleteTicket = (slug: string) =>
  APIFetch.delete<never>(`/api/ticket/${slug}`);

const getTicketComments = (slug: string) =>
  APIFetch.get<Comment[]>(`/api/ticket/${slug}/comments`);

const createComment = (slug: string, body: CreateCommentBody) =>
  APIFetch.post<Comment>(`/api/ticket/${slug}/comment`, {
    body: body,
  });

const deleteComment = (id: number) =>
  APIFetch.delete<never>(`/api/comment/${id}`);

export default {
  getUser,
  createUser,
  queryUsers,
  login,
  logout,
  whoami,
  createProject,
  getProject,
  editProject,
  deleteProject,
  queryProjects,
  getProjectTickets,
  createTicket,
  getTicket,
  editTicket,
  deleteTicket,
  getTicketComments,
  createComment,
  deleteComment,
};

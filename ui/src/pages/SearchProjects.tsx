import {
  MagnifyingGlassIcon,
  PlusIcon,
  TicketIcon,
} from "@heroicons/react/20/solid";
import { CreateProjectBody, Project } from "../types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import API from "../api";
import useTitle from "../hooks/useTitle";
import Username from "../components/Username";
import Input from "../components/Input";
import LinkButton from "../components/LinkButton";
import ProjectEditorModal from "../components/ProjectEditorModal";
import { toast } from "react-toastify";

interface ProjectTabProps {
  project: Project;
}

const ProjectTab = ({ project }: ProjectTabProps) => {
  return (
    <Link
      className="ring-border flex min-h-[80px] min-w-[200px] gap-2 rounded-md bg-white py-2 pr-2 shadow filter hover:bg-gray-50 active:brightness-95"
      to={`/project/${project.key}`}
    >
      <div className="flex w-24 items-center justify-center border-r-[1px] text-3xl font-bold text-gray-400 drop-shadow-sm">
        {project.key}
      </div>
      <div className="flex flex-grow flex-col justify-between gap-1">
        <span className="text-xl font-semibold text-gray-700">
          {project.title}
        </span>
        <div className="flex items-center gap-1">
          <TicketIcon className="h-5 w-5 text-gray-600" />
          <div className="font-semibold text-gray-600">
            {project.ticket_count} Tickets
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Username user={project.owner} />
        </div>
      </div>
    </Link>
  );
};

const SearchProjects = () => {
  useTitle("Search Projects");
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [query, setQuery] = React.useState("");
  const [formError, setFormError] = React.useState<string | undefined>(
    undefined
  );
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    API.queryProjects(query).then((response) => {
      if (response.ok) {
        setProjects(response.data);
      } else {
        toast.error(`Project query failed: ${response.error.message}`);
      }
    });
  }, [query]);

  const closeModal = () => {
    navigate("/projects");
  };

  const handleProjectCreateSubmit = (data: CreateProjectBody) => {
    API.createProject(data).then((response) => {
      if (response.ok) {
        navigate(`/project/${data.key}`);
      } else {
        setFormError(response.error.message);
      }
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-2 py-4">
      <div className="mx-auto flex justify-center gap-2">
        <Input
          id="project_query"
          onChange={(event) => setQuery(event.target.value)}
          icon={<MagnifyingGlassIcon className="h-6 w-6" />}
          className="flex-grow sm:max-w-[400px]"
          placeholder="Project Name or Key"
        />
        <LinkButton
          className="right-0 bg-emerald-400 hover:bg-emerald-500 sm:self-end"
          icon={<PlusIcon />}
          to="/projects/create"
        >
          Create Project
        </LinkButton>
      </div>
      <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.key}>
            <ProjectTab project={project} />
          </div>
        ))}
      </div>
      {location.pathname.endsWith("/create") && (
        <ProjectEditorModal
          mode="add"
          onSubmit={handleProjectCreateSubmit}
          onCancel={closeModal}
          formError={formError}
        />
      )}
    </div>
  );
};

export default SearchProjects;

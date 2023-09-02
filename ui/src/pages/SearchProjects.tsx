import { MagnifyingGlassIcon, TicketIcon } from "@heroicons/react/20/solid";
import { Project } from "../types";
import { Link } from "react-router-dom";
import React from "react";
import API from "../api";
import useTitle from "../hooks/useTitle";
import Username from "../components/Username";
import Input from "../components/Input";

interface ProjectTabProps {
  project: Project;
}

const ProjectTab = ({ project }: ProjectTabProps) => {
  return (
    <Link
      className="flex min-h-[80px] min-w-[200px] gap-2 rounded-md bg-white py-2 pr-2 shadow ring-1 ring-black ring-opacity-5 filter hover:bg-gray-50 active:brightness-95"
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
          <TicketIcon className="h-6 w-6 text-gray-600" />
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

  React.useEffect(() => {
    // if (query.length === 0) return setProjects([]);

    API.queryProjects(query).then((response) => {
      if (response.ok) {
        setProjects(response.data);
      }
    });
  }, [query]);

  return (
    <div className="mx-auto max-w-[1200px] px-2 py-4">
      <Input
        id="project_query"
        onChange={(event) => setQuery(event.target.value)}
        icon={<MagnifyingGlassIcon className="h-6 w-6" />}
        className="mx-auto sm:max-w-[500px]"
        placeholder="Project Name or Key"
      />
      <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div className="py-0-2" key={project.key}>
            <ProjectTab project={project} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchProjects;

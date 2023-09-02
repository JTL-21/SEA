import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { UserCircleIcon } from "@heroicons/react/24/solid";
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
      <div className="flex flex-col justify-between">
        <span className="text-xl font-semibold text-gray-500">
          {project.title}
        </span>
        <Username user={project.owner} />
      </div>
    </Link>
  );
};

const Placeholder = ({ index }: { index: number }) => {
  return (
    <div
      className="flex min-h-[80px] min-w-[200px] select-none gap-2 rounded-md bg-gray-50 p-2 py-2 pr-2 text-transparent"
      style={{ opacity: 1 - Math.floor(index / 3) / 6 }}
    >
      <div className="flex w-24 items-center justify-center text-3xl font-bold drop-shadow-sm">
        KEY
      </div>
      <div className="flex flex-col justify-between">
        <span className="text-xl font-semibold">TITLE</span>
        <div className="flex gap-1">
          <UserCircleIcon className="h-6 w-6" />
          <span>USERNAME</span>
        </div>
      </div>
    </div>
  );
};

const SearchProjects = () => {
  useTitle("Search Projects");
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (query.length === 0) return setProjects([]);

    API.queryProjects(query).then((response) => {
      if (response.ok) {
        setProjects(response.data);
      }
    });
  }, [query]);

  return (
    <div className="px-2 py-4">
      <Input
        id="project_query"
        onChange={(event) => setQuery(event.target.value)}
        icon={<MagnifyingGlassIcon className="h-6 w-6" />}
        className="mx-auto sm:max-w-[500px]"
      />
      <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-2 md:grid-cols-3">
        {projects.map((project) => (
          <div className="py-0-2" key={project.key}>
            <ProjectTab project={project} />
          </div>
        ))}
        {projects.length === 0 && [
          // </span> //   No projects found... // <span className="px-2 text-sm text-gray-400">
          Array.from({ length: 15 }).map((_, index) => (
            <Placeholder key={index} index={index} />
          )),
        ]}
      </div>
    </div>
  );
};

export default SearchProjects;

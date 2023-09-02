import logo from "../assets/kong.png";
import useUser from "../hooks/useUser";
import { Link } from "react-router-dom";
import { BoltIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import React from "react";

const topBarLinkClasses = "text-gray-500 hover:underline";

interface LabeledIconProps {
  icon: React.ReactNode;
  text: string;
}

const LabeledIcon = ({ icon, text }: LabeledIconProps) => {
  return (
    <div
      title={text}
      className="flex flex-col items-center text-xs text-gray-600"
    >
      <div className="[&>svg]:h-8 [&>svg]:w-8">{icon}</div>
      {text}
    </div>
  );
};

const TopBar = () => {
  const { user } = useUser();

  return (
    <div
      className="fixed left-0 right-0 top-0 h-14 bg-white p-4 shadow"
      title="home"
    >
      <div className="flex h-full items-center gap-2">
        <Link to="/" className="mr-2 flex items-center gap-2">
          <img src={logo} alt="logo" className="block h-6" />
          <h1 className="-mt-1 select-none text-2xl font-light text-amber-950">
            Kong
          </h1>
        </Link>
        <Link to="/projects" className={topBarLinkClasses}>
          Projects
        </Link>
        <Link to="/create-project" className={topBarLinkClasses}>
          Create Project
        </Link>
        <div className="flex-grow"></div>
        <LabeledIcon
          icon={<UserCircleIcon />}
          text={user?.username ?? "Not signed in"}
        />
        {user && user.is_admin && (
          <LabeledIcon
            icon={<BoltIcon className="text-amber-400" />}
            text="Admin"
          />
        )}
      </div>
    </div>
  );
};

export default TopBar;

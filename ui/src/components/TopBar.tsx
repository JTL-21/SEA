import {
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import cn from "clsx";
import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/kong.png";
import useUser from "../hooks/useUser";
import Admin from "./icons/Admin";

const topBarLinkClasses = "text-gray-500 hover:underline";

interface LabeledIconProps extends React.ComponentPropsWithoutRef<"div"> {
  icon: React.ReactNode;
  text: string;
}

const LabeledIcon = ({
  icon,
  text,
  className,
  ...divProps
}: LabeledIconProps) => {
  return (
    <div
      title={text}
      className={cn(
        className,
        "flex flex-col items-center text-xs text-gray-600"
      )}
      {...divProps}
    >
      <div className="[&>svg]:h-8 [&>svg]:w-8">{icon}</div>
      {text}
    </div>
  );
};

const TopBar = () => {
  const { user, logout } = useUser();

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
        <div className="flex-grow"></div>
        <LabeledIcon
          icon={user?.is_admin ? <Admin /> : <UserCircleIcon />}
          text={user?.username ?? "Not signed in"}
        />
        {user && (
          <button className="hover:drop-shadow" onClick={logout}>
            <LabeledIcon
              icon={<ArrowLeftOnRectangleIcon />}
              text={"Sign Out"}
              className="ml-2"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default TopBar;

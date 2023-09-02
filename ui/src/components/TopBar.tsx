import logo from "../assets/kong.png";
import useUser from "../hooks/useUser";
import { Link } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const topBarLinkClasses = "text-gray-500 hover:underline";

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
        <div
          title={user ? user.username : "Sign In"}
          className="flex flex-col items-center text-xs text-gray-600"
        >
          <UserCircleIcon className="h-8 w-8" />
          {user?.username ?? "Sign In"}
        </div>
      </div>
    </div>
  );
};

export default TopBar;

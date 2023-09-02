import logo from "../assets/kong.png";
import { Link } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import useUser from "../hooks/useUser";

const TopBar = () => {
  const user = useUser();

  return (
    <div
      className="fixed left-0 right-0 top-0 h-14 bg-white p-3 shadow"
      title="home"
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center gap-2">
        <Link to="/" className="flex h-full items-center gap-2">
          <img src={logo} alt="logo" className="h-full" />
          <h1 className="select-none text-3xl font-light text-amber-950">
            Kong
          </h1>
        </Link>
        <div className="flex-grow"></div>
        <Link
          to={user.user ? `/account/${user.user.username}` : "/sign-in"}
          title={user.user ? "Account" : "Sign In"}
          className="flex flex-col items-center text-xs text-gray-600"
        >
          <UserCircleIcon className="h-8 w-8 cursor-pointer" />
          {user.user?.username ?? "Sign In"}
        </Link>
      </div>
    </div>
  );
};

export default TopBar;

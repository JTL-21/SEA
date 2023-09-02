import { UserCircleIcon } from "@heroicons/react/24/solid";
import { User } from "../types";
import Admin from "./icons/Admin";

interface UsernameProps extends React.ComponentPropsWithoutRef<"div"> {
  user: User;
  icons?: boolean;
}

const Username = ({ user, icons = true, ...divProps }: UsernameProps) => {
  return icons ? (
    <div className="flex items-center gap-1 text-gray-600" {...divProps}>
      {user.is_admin ? (
        <Admin className="h-5 w-5" />
      ) : (
        <UserCircleIcon className="h-5 w-5" />
      )}

      <span className="font-semibold text-gray-600">{user.username}</span>
    </div>
  ) : (
    <>{user.username}</>
  );
};

export default Username;

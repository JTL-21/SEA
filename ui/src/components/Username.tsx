import { UserCircleIcon, BoltIcon } from "@heroicons/react/24/solid";
import { User } from "../types";

interface UsernameProps extends React.ComponentPropsWithoutRef<"div"> {
  user: User;
  icons?: boolean;
}

const Username = ({ user, icons = true, ...divProps }: UsernameProps) => {
  return icons ? (
    <div className="flex items-center gap-1 text-gray-600" {...divProps}>
      <UserCircleIcon className="h-5 w-5" />
      {user.is_admin && <BoltIcon className="h-5 w-5 text-amber-400" />}

      <span className="font-semibold text-gray-600">{user.username}</span>
    </div>
  ) : (
    <>{user.username}</>
  );
};

export default Username;

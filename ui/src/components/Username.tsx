import { UserCircleIcon, BoltIcon } from "@heroicons/react/24/solid";
import { User } from "../types";

interface UsernameProps extends React.ComponentPropsWithoutRef<"div"> {
  user: User;
  icons?: boolean;
}

const Username = ({ user, icons = true, ...divProps }: UsernameProps) => {
  return icons ? (
    <div className="flex gap-1 text-gray-600" {...divProps}>
      <UserCircleIcon className="h-6 w-6" />
      {user.is_admin && <BoltIcon className="h-6 w-6 text-amber-400" />}

      <span className="font-semibold text-gray-600">{user.username}</span>
    </div>
  ) : (
    <>{user.username}</>
  );
};

export default Username;

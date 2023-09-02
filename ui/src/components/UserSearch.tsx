import React from "react";
import { User } from "../types";
import { Combobox } from "@headlessui/react";
import API from "../api";
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import cn from "clsx";

interface UserSearchProps {
  onChange: (user: User) => void;
}

const UserSearch = ({ onChange }: UserSearchProps) => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (query.length === 0) return;

    API.queryUsers(query).then((response) => {
      if (response.ok) {
        setUsers(response.data);
      }
    });
  }, [query]);

  const handleOnChange = (value: User | null) => {
    if (!value) return;
    onChange(value);
  };

  return (
    <Combobox onChange={handleOnChange}>
      <div className="list-none overflow-hidden rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-10">
        <div className="flex items-center gap-1 border-b-[1px] pl-2">
          <MagnifyingGlassIcon className="h-6 w-6" />
          <Combobox.Input
            onChange={(event) => setQuery(event.target.value)}
            className="rounded-r-md p-2 focus:outline-none focus:ring-0"
          />
        </div>
        <Combobox.Options as="div" className="flex flex-col py-1">
          {users.map((user) => (
            <Combobox.Option key={user.username} value={user}>
              {({ active }) => (
                <div
                  className={cn(
                    "flex cursor-pointer items-center gap-1 px-2 py-1",
                    active && "bg-amber-100"
                  )}
                >
                  <UserCircleIcon className="h-6 w-6" />
                  {user.username}
                </div>
              )}
            </Combobox.Option>
          ))}
          {users.length === 0 && (
            <span className="px-2 text-sm text-gray-400">
              No users found...
            </span>
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  );
};

export default UserSearch;

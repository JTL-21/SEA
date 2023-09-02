import { Link } from "react-router-dom";
import Button from "./Button";
import useUser from "../hooks/useUser";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

const App = () => {
  const { logout } = useUser();

  return (
    <div className="flex flex-col gap-2 text-indigo-600">
      <Link to="/sign-in">Sign In</Link>
      <Link to="/sign-up">Sign Up</Link>
      <Link to="/create-project">Create Project</Link>
      <Link to="/project/ABC">View Project ABC</Link>
      <span>
        <Button
          centered={false}
          icon={<ArrowLeftOnRectangleIcon />}
          onClick={logout}
        >
          Log Out
        </Button>
      </span>
    </div>
  );
};

export default App;

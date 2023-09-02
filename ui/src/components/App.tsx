import { Link } from "react-router-dom";

const App = () => {
  return (
    <div className="flex flex-col gap-2 text-indigo-600 underline">
      <Link to="/sign-in">Sign In</Link>
      <Link to="/sign-up">Sign Up</Link>
      <Link to="/create-project">Create Project</Link>
      <Link to="/project/ABC">View Project ABC</Link>
    </div>
  );
};

export default App;

import MarkdownEditor from "./MarkdownEditor";

const App = () => {
  return (
    <div className="mx-auto max-w-[1000px] p-2 text-gray-900">
      <form action="" className="flex flex-col gap-4">
        <input type="text" name="username" id="username" />
        <input type="password" name="password" id="password" />
        <select name="test" id="test">
          <option value="value1">Value 1</option>
          <option value="value2">Value 2</option>
          <option value="value3">Value 3</option>
          <option value="value4">Value 4</option>
          <option value="value5">Value 5</option>
        </select>
        <div className="flex items-center">
          <input type="checkbox" name="check" id="check" />
          <label htmlFor="check" className="ml-2 text-sm">
            Remember Me
          </label>
        </div>
        <MarkdownEditor />
      </form>
    </div>
  );
};

export default App;

import React from "react";
import Markdown from "./Markdown";
import cn from "clsx";

const tabButtonClasses = cn(
  "relative top-[1px] h-8 w-16 rounded-t-lg border-[1px] border-b-0 border-r-0 border-stone-300 bg-white text-sm text-gray-800 [&:last-child]:border-r-[1px]",
  "md:cursor-default md:border-r-[1px]"
);

const offTabButtonClasses = "filter brightness-95 md:brightness-100";

const MarkdownEditor = () => {
  const [content, setContent] = React.useState("");
  const [focus, setFocus] = React.useState<"edit" | "preview">("edit");
  const id = React.useId();

  return (
    <div className="h-auto w-full drop-shadow-md [&:focus-within>div:first-child>button]:border-indigo-400 [&:focus-within>div:last-child>.focus]:border-indigo-400">
      <div className="relative">
        <button
          type="button"
          className={cn(
            tabButtonClasses,
            focus !== "edit" && offTabButtonClasses
          )}
          onClick={() => setFocus("edit")}
        >
          Edit
        </button>
        <button
          type="button"
          className={cn(
            tabButtonClasses,
            focus !== "preview" && offTabButtonClasses,
            "absolute md:left-1/2 md:ml-[1px] md:-translate-x-full"
          )}
          onClick={() => setFocus("preview")}
        >
          Preview
        </button>
      </div>
      <div className="flex h-64 [&>*]:basis-full">
        <textarea
          name={`markdown-input-${id}`}
          id={`markdown-input-${id}`}
          value={content}
          onChange={(e) => setContent(e.currentTarget.value)}
          className={cn(
            "focus block h-auto resize-none rounded-md rounded-tl-none border-stone-300 shadow-none focus:ring-0 md:block md:rounded-r-none",
            focus !== "edit" && "hidden"
          )}
        ></textarea>
        <Markdown
          className={cn(
            focus !== "preview" && "hidden",
            "focus overflow-y-scroll rounded-md rounded-tl-none border-[1px] border-stone-300 bg-white p-2 md:block md:rounded-bl-none md:border-l-0"
          )}
        >
          {content}
        </Markdown>
      </div>
    </div>
  );
};

export default MarkdownEditor;

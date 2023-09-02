import React from "react";
import Markdown from "./Markdown";
import cn from "clsx";

interface MarkdownEditorProps
  extends Omit<
    React.ComponentPropsWithoutRef<"textarea">,
    "name" | "className"
  > {
  value?: string;
  responsive?: boolean;
}

const buttonClasses = "hover:bg-gray-200 px-4 py-1";

const MarkdownEditor = React.forwardRef<
  HTMLTextAreaElement,
  MarkdownEditorProps
>(({ value, responsive = false, id, ...textAreaProps }, ref) => {
  const [focus, setFocus] = React.useState<"edit" | "preview">("edit");

  return (
    <div className="h-auto w-full overflow-hidden rounded-md border-[1px] border-gray-300 shadow-sm ring-1 ring-black ring-opacity-5 focus-within:ring-2 focus-within:ring-amber-300">
      <div className="flex border-b-[1px]">
        <button
          type="button"
          className={cn(
            buttonClasses,
            focus === "edit" ? "bg-gray-100" : "bg-white"
          )}
          onClick={() => setFocus("edit")}
        >
          Edit
        </button>
        <button
          type="button"
          className={cn(
            buttonClasses,
            focus === "preview" ? "bg-gray-100" : "bg-white"
          )}
          onClick={() => setFocus("preview")}
        >
          Preview
        </button>
      </div>
      <div className="flex h-64 [&>*]:basis-full">
        <textarea
          name={id}
          id={id}
          // value={value}
          {...textAreaProps}
          className={cn(
            "block h-auto resize-none border-none bg-transparent focus:outline-0 focus:ring-0",
            focus !== "edit" && "hidden",
            responsive && "md:block"
          )}
          ref={ref}
        ></textarea>
        <Markdown
          className={cn(
            "overflow-y-scroll p-2",
            focus !== "preview" && "hidden",
            responsive && "md:block"
          )}
        >
          {value}
        </Markdown>
      </div>
    </div>
  );
});

export default MarkdownEditor;

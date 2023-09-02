import React from "react";
import Markdown from "./Markdown";
import cn from "clsx";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MarkdownEditorProps
  extends Omit<
    React.ComponentPropsWithoutRef<"textarea">,
    "name" | "className"
  > {
  value?: string;
  responsive?: boolean;
}

const tabButtonClasses = cn(
  "relative top-[1px] h-6 w-16 rounded-t-lg border-[1px] border-b-0 border-r-0 border-stone-300 bg-white text-sm text-gray-800 [&:last-child]:border-r-[1px]",
  "md:border-r-[1px]"
);

const offTabButtonClasses = "filter brightness-95";

const MarkdownEditor = React.forwardRef<
  HTMLTextAreaElement,
  MarkdownEditorProps
>(({ value, responsive = false, id, ...textAreaProps }, ref) => {
  const [focus, setFocus] = React.useState<"edit" | "preview">("edit");

  return (
    <div className="h-auto w-full drop-shadow-md [&:focus-within>div:first-child>button]:border-amber-400 [&:focus-within>div:last-child>.focus]:border-amber-400">
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
            responsive &&
              "absolute md:left-1/2 md:ml-[-1px] md:-translate-x-full"
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
            "focus  block h-auto resize-none rounded-md rounded-tl-none border-b-[1px] border-stone-300 p-1 shadow-none focus:ring-0",
            focus !== "edit" && "hidden",
            responsive && "md:block md:rounded-r-none"
          )}
          ref={ref}
        ></textarea>
        <Markdown
          className={cn(
            focus !== "preview" && "hidden",
            "focus  overflow-y-scroll rounded-md rounded-tl-none border-[1px] border-stone-300 bg-white p-1",
            responsive && "md:block md:rounded-bl-none md:border-l-0"
          )}
        >
          {value}
        </Markdown>
      </div>
    </div>
  );
});

export default MarkdownEditor;

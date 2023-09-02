import React from "react";
import ReactMarkdown from "react-markdown";
import cn from "../utils/cn";

interface Props
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  children?: string;
}

const Markdown = ({ children, className, ...divProps }: Props) => {
  return (
    <ReactMarkdown
      className={cn(
        "prose prose-headings:m-0 prose-li:my-0.5 prose-headings:font-semibold prose-headings:mt-4 prose-ul:m-0 prose-ol:m-0 prose-p:mt-0 prose-hr:my-2 prose-blockquote:my-2",
        className
      )}
      {...divProps}
    >
      {children ?? ""}
    </ReactMarkdown>
  );
};

export default Markdown;

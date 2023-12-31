import React from "react";
import ReactMarkdown from "react-markdown";
import cn from "../utils/cn";

interface Props
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  children?: string | string[];
}

const allowedElements = ["b", "i", "em", "p", "a", "pre", "code", "strong"];

const Markdown = ({ children = "", className, ...divProps }: Props) => {
  return (
    <ReactMarkdown
      className={cn("prose-sm prose-p:mt-0 prose-p:break-words", className)}
      allowedElements={allowedElements}
      unwrapDisallowed={true}
      {...divProps}
    >
      {typeof children === "object" ? children.join(" ") : children}
    </ReactMarkdown>
  );
};

export default Markdown;

import React from "react";
import ReactMarkdown from "react-markdown";
import cn from "clsx";

interface Props extends Omit<React.HTMLProps<HTMLDivElement>, "children"> {
  children: string;
}

const Markdown = ({ children, className, ...divProps }: Props) => {
  return (
    <ReactMarkdown
      className={cn(
        "prose prose-headings:m-0 prose-ul:m-0 prose-ol:m-0 prose-hr:my-8 prose-p:mt-0",
        className
      )}
      {...divProps}
    >
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;

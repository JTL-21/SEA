import React from "react";
import cn from "clsx";

interface Props extends React.ComponentPropsWithoutRef<"button"> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

const Button = ({ icon, children, type, className, ...buttonProps }: Props) => {
  return (
    <button
      type={type ?? "button"}
      {...buttonProps}
      className={cn(
        "rounded-md bg-amber-400 px-4 py-2 font-semibold text-white shadow filter hover:bg-amber-500 active:brightness-95",
        className
      )}
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;

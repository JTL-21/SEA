import React from "react";
import cn from "clsx";
import Close from "./icons/Close";

interface Props extends React.ComponentPropsWithoutRef<"button"> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  styled?: boolean;
  centered?: boolean;
  requireConfirmation?: boolean;
}

const Button = ({
  icon,
  styled = true,
  centered = true,
  requireConfirmation,
  children,
  type,
  className,
  onClick,
  onMouseLeave,
  ...buttonProps
}: Props) => {
  const [waiting, setWaiting] = React.useState(false);

  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (requireConfirmation) {
      if (waiting) {
        onClick && onClick(event);
      } else {
        setWaiting(true);
      }
    } else {
      onClick && onClick(event);
    }
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
    onMouseLeave && onMouseLeave(event);

    setWaiting(false);
  };

  return (
    <button
      type={type ?? "button"}
      {...buttonProps}
      onClick={handleOnClick}
      onMouseLeave={handleMouseLeave}
      className={cn(
        styled &&
          "rounded-md bg-amber-400 px-4 py-2 font-semibold text-white shadow filter hover:bg-amber-500 active:brightness-95",
        centered ? "justify-center" : "justify-start",
        "flex items-center gap-1 [&>svg]:h-6 [&>svg]:w-6",
        className
      )}
    >
      {requireConfirmation && waiting ? (
        <>
          <Close className="text-rose-600" />
          <span className="font-semibold text-rose-600">
            Confirm {children}
          </span>
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;

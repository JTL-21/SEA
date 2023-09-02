import React from "react";
import cn from "clsx";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface Props extends React.ComponentPropsWithoutRef<"button"> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  styled?: boolean;
  centered?: boolean;
  requireConfirmation?: boolean;
  confirmClasses?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
}

const Button = React.forwardRef<HTMLButtonElement, Props>(
  (
    {
      icon,
      styled = true,
      centered = true,
      requireConfirmation,
      children,
      type,
      className,
      confirmClasses = "text-rose-600",
      onClick,
      onMouseLeave,
      as: Component = "button",
      ...buttonProps
    },
    ref
  ) => {
    const [waiting, setWaiting] = React.useState(false);

    const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (requireConfirmation) {
        if (waiting) {
          onClick && onClick(event);
          setWaiting(false);
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
      <Component
        type={type ?? "button"}
        {...buttonProps}
        onClick={handleOnClick}
        onMouseLeave={handleMouseLeave}
        ref={ref}
        className={cn(
          styled &&
            "rounded-md bg-amber-400 px-4 py-2 font-semibold text-white shadow filter hover:bg-amber-500 active:brightness-95",
          centered ? "justify-center" : "justify-start",
          "flex items-center gap-2 [&>svg]:h-6 [&>svg]:w-6",
          className
        )}
      >
        {requireConfirmation && waiting ? (
          <>
            <XMarkIcon className={confirmClasses} />
            <span className={cn("font-semibold", confirmClasses)}>
              Confirm {children}
            </span>
          </>
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </Component>
    );
  }
);

export default Button;

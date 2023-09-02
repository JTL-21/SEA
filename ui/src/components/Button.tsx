import React, { JSXElementConstructor } from "react";
import cn from "clsx";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Props extends React.ComponentPropsWithoutRef<"button"> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  styled?: boolean;
  centered?: boolean;
  requireConfirmation?: boolean;
  as?: keyof JSX.IntrinsicElements | JSXElementConstructor<any>;
}

const Button = React.forwardRef<HTMLElement, Props>(
  (
    {
      icon,
      styled = true,
      centered = true,
      requireConfirmation,
      children,
      type,
      className,
      onClick,
      onMouseLeave,
      as: Element = "button",
      ...buttonProps
    },
    ref
  ) => {
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
      <Element
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
            <XMarkIcon className="text-rose-600" />
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
      </Element>
    );
  }
);

export default Button;
export type { Props };

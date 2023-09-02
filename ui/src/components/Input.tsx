import React from "react";
import { FieldError } from "react-hook-form";
import cn from "clsx";

interface Props extends Omit<React.ComponentPropsWithoutRef<"input">, "id"> {
  error?: FieldError;
  label?: string;
  id: string;
  icon?: React.ReactNode;
  styled?: boolean;
  errorClasses?: string;
  focusClasses?: string;
  labelClasses?: string;
}

const Input = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      error,
      label,
      id,
      icon,
      className,
      styled = true,
      errorClasses,
      focusClasses,
      labelClasses,
      ...inputProps
    },
    ref
  ) => {
    return (
      <div className={cn("relative", className)}>
        <label
          htmlFor={id}
          className={cn(
            styled && !labelClasses && "text-sm font-semibold text-gray-700",
            labelClasses
          )}
        >
          {label}
        </label>
        <input
          {...inputProps}
          ref={ref}
          id={id}
          name={inputProps.name ?? id}
          placeholder={label}
          className={cn(
            styled &&
              "block w-full rounded-md border-[1px] border-gray-300 px-3.5 py-2 text-gray-900 shadow-sm ring-0 placeholder:text-gray-400",
            styled &&
              !focusClasses &&
              "focus:ring-2 focus:ring-inset focus:ring-amber-400 focus:ring-offset-1",
            styled &&
              error &&
              !errorClasses &&
              "ring-2 ring-rose-400 ring-offset-2",
            errorClasses,
            focusClasses,
            icon && "pl-10"
          )}
        />
        {icon && (
          <div
            className={cn(
              "absolute left-2 text-gray-500 [&>svg]:h-6 [&>svg]:w-6",
              label ? "top-[33px]" : "top-[9px]"
            )}
          >
            {icon}
          </div>
        )}
        <div className="absolute right-0 top-0 text-xs font-semibold text-rose-500">
          {error?.message}
        </div>
      </div>
    );
  }
);

export default Input;

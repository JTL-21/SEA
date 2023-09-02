import React from "react";
import { FieldError } from "react-hook-form";
import cn from "clsx";

interface Props extends Omit<React.ComponentPropsWithoutRef<"input">, "id"> {
  error?: FieldError;
  label: string;
  id: string;
}

const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ error, id, label, className, ...inputProps }, ref) => {
    return (
      <div className={cn("relative", className)}>
        <label htmlFor={id} className="text-sm font-semibold text-gray-700">
          {label}
        </label>
        <input
          {...inputProps}
          ref={ref}
          id={id}
          name={inputProps.name ?? id}
          placeholder={label}
          className={cn(
            "block w-full rounded-md border-[1px] border-gray-300 px-3.5 py-2 text-gray-900 shadow-sm ring-0 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-400 focus:ring-offset-1",
            error && "ring-2 ring-rose-400 ring-offset-2"
          )}
        />
        <div className="absolute right-0 top-0 text-xs text-rose-500">
          {error?.message}
        </div>
      </div>
    );
  }
);

export default Input;

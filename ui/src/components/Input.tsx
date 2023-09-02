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
      <div className={cn(className, "relative mt-2")}>
        <input
          {...inputProps}
          ref={ref}
          id={id}
          name={inputProps.name ?? id}
          placeholder={label}
          className={cn(
            "peer w-full placeholder-transparent",
            error && "!border-b-rose-500"
          )}
        />
        <label
          htmlFor={id}
          className={cn(
            "absolute -top-4 left-0 text-xs text-gray-700 transition-all duration-100",
            "peer-placeholder-shown:top-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400",
            "peer-focus:-top-4 peer-focus:left-0 peer-focus:text-xs peer-focus:text-gray-700"
          )}
        >
          {label}
        </label>
        <div className="text-sm text-rose-500">{error?.message}</div>
      </div>
    );
  }
);

export default Input;

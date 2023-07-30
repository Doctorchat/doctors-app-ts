import * as React from "react";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

import { cn } from "@/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-neutral-200 bg-white px-3 py-1 shadow-sm transition-colors file:border-0",
          "file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1",
          "focus-visible:ring-neutral-400 disabled:cursor-not-allowed disabled:opacity-50",
          "aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export interface PasswordInputProps extends Omit<InputProps, "type"> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={isPasswordVisible ? "text" : "password"}
          className={cn("pr-11", className)}
          {...props}
        />
        <button
          type="button"
          aria-label="Toggle password visibility"
          className="absolute inset-y-px right-px rounded-r-md px-3 text-typography-secondary transition-colors active:text-typography-primary md:hover:text-typography-primary"
          onClick={() => setIsPasswordVisible((prev) => !prev)}
        >
          {isPasswordVisible ? (
            <EyeIcon className="h-5 w-5" />
          ) : (
            <EyeSlashIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { Input, PasswordInput };

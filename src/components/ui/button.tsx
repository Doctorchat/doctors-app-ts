import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1",
    "focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: ["bg-rose-600 text-white shadow md:hover:bg-rose-600/90 active:bg-rose-600/90"],
        destructive: [
          "bg-red-500 text-neutral-50 shadow-sm md:hover:bg-red-500/90 active:bg-red-500/90",
        ],
        outline: [
          "border border-neutral-200 bg-white shadow-sm md:hover:bg-neutral-100 md:hover:text-neutral-900",
          "active:bg-neutral-100 active:text-neutral-900",
        ],
        secondary: [
          "bg-neutral-100 text-neutral-800 shadow-sm md:hover:text-typography-primary md:hover:bg-neutral-200/90",
          "active:bg-neutral-200/90 active:text-typography-primary",
        ],

        ghost: [
          "md:hover:bg-neutral-100 md:hover:text-typography-primary active:bg-neutral-100 active:text-typography-primary",
        ],
        link: "text-neutral-900 underline-offset-4 md:hover:underline active:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9 text-neutral-700",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, type = "button", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

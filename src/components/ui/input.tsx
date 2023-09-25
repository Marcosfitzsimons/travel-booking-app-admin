import * as React from "react";

import { cn } from "../../lib/utils";
import GorgeousBorder from "../GorgeousBorder";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="flex flex-1 items-center">
        <GorgeousBorder className="w-full dark:border-slate-800">
          <input
            className={cn(
              "w-full px-3.5 py-2 relative text-sm bg-card rounded-lg border border-slate-400/30 shadow-input placeholder:text-neutral-500 dark:placeholder:text-pink-1-100/70 dark:bg-[hsl(0,0%,11%)] dark:border-slate-800 dark:text-white dark:shadow-none !outline-none",
              className
            )}
            ref={ref}
            {...props}
          />
        </GorgeousBorder>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

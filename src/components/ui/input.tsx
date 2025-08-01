
import * as React from "react"
import { cn } from "@/lib/utils"
import { IMaskInput } from "react-imask"

export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  mask?: any;
  unmask?: boolean;
  onAccept?: (value: any, mask: any) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, mask, unmask, onAccept, ...props }, ref) => {
    if (mask) {
      return (
        <IMaskInput
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          mask={mask}
          unmask={unmask}
          inputRef={ref}
          onAccept={onAccept}
          // Explicitly exclude 'max' and 'min' if they're strings to avoid type conflicts
          {...Object.fromEntries(
            Object.entries(props).filter(([key]) => 
              !(key === 'max' || key === 'min') || 
              (typeof props[key as keyof typeof props] !== 'string')
            )
          )}
        />
      )
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

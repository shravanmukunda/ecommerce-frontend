import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-[#1a1a1a] bg-[#0f0f0f] px-3 py-2 text-base text-[#e5e5e5] ring-offset-[#0f0f0f] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#e5e5e5] placeholder:text-[#666] focus-visible:outline-none focus-visible:border-[#00bfff] focus-visible:ring-2 focus-visible:ring-[#00bfff]/20 focus-visible:ring-offset-2 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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

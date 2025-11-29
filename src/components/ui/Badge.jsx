import * as React from "react"
import { cn } from "../../utils/cn"

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
    const variants = {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-sm",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-sm",
        outline: "text-foreground border-border hover:bg-accent",
        success: "border-transparent bg-success text-success-foreground hover:bg-success/90 shadow-sm",
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm",
    }

    return (
        <div
            ref={ref}
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                variants[variant],
                className
            )}
            {...props}
        />
    )
})
Badge.displayName = "Badge"

export { Badge }

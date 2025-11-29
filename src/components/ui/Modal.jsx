import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../utils/cn"
import { Button } from "./Button"

const Modal = ({ isOpen, onClose, title, children, className }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-200 animate-in fade-in">
            <div
                className={cn(
                    "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-card p-6 shadow-2xl duration-200 sm:rounded-xl animate-in zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%]",
                    className
                )}
            >
                <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold leading-none tracking-tight">{title}</h2>
                        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </div>
                </div>
                {children}
            </div>
        </div>
    )
}

export { Modal }

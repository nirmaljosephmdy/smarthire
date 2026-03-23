import * as React from "react"

// A simplified generic Select drop-in for standard HTML select to avoid radix complex implementation
export const Select = ({ children, onValueChange, ...props }: any) => {
  return <div className="relative w-full">{React.cloneElement(children as any, { onValueChange })}</div>
}

export const SelectTrigger = React.forwardRef<HTMLSelectElement, any>(({ className, children, ...props }, ref) => (
  <select ref={ref} className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none px-3 ${className}`} {...props}>
    {children}
  </select>
))
SelectTrigger.displayName = "SelectTrigger"

export const SelectValue = ({ placeholder }: any) => <option value="" disabled hidden>{placeholder}</option>

export const SelectContent = ({ children }: any) => <>{children}</>

export const SelectItem = ({ value, children }: any) => <option value={value} className="text-black dark:text-white bg-background">{children}</option>

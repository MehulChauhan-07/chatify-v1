"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
}

const statusMap = {
  online: "bg-success-500",
  offline: "bg-neutral-400",
  away: "bg-warning-500",
}

const Avatar = React.forwardRef(({ className, src, alt, size = "md", status, ...props }, ref) => {
  const sizeClass = sizeMap[size] || sizeMap.md
  const statusClass = status ? statusMap[status] || statusMap.offline : ""
  
  return (
    <div className="relative inline-block" ref={ref}>
      <AvatarPrimitive.Root
        className={cn("relative flex shrink-0 overflow-hidden rounded-full", sizeClass, className)}
        {...props}
      >
        {src && (
          <AvatarPrimitive.Image
            src={src}
            alt={alt}
            className="aspect-square h-full w-full object-cover"
          />
        )}
        <AvatarPrimitive.Fallback
          className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-sm font-medium"
          )}
        >
          {alt ? alt.charAt(0).toUpperCase() : "?"}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-neutral-800",
            statusClass
          )}
        />
      )}
    </div>
  )
})
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props} />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props} />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }

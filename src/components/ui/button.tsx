import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base — square corners, tight tracking, amber focus ring, no rounding anywhere
  "group/button inline-flex shrink-0 items-center justify-center rounded-none border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/60 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-40 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Solid amber — primary CTA (LOG SESSION, SIGN IN, etc.)
        default:
          "bg-primary text-primary-foreground tracking-widest uppercase text-sm font-bold hover:bg-[#b8721f] active:bg-[#7A4F1A] punch-glow",
        // Hairline border — secondary actions
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted tracking-wider uppercase text-sm dark:border-[rgba(245,240,232,0.16)] dark:hover:bg-[#2E2922]",
        // Raised surface — tertiary / nav-style
        secondary:
          "bg-[#2E2922] text-foreground hover:bg-[#22201C] tracking-wider uppercase text-sm",
        // No background — inline text actions
        ghost:
          "text-muted-foreground hover:text-foreground hover:bg-[#2E2922] tracking-wider uppercase text-sm",
        // Brick red — destructive / warning
        destructive:
          "bg-[#A83030]/15 text-[#A83030] border border-[#A83030]/30 hover:bg-[#A83030]/25 tracking-wider uppercase text-sm",
        // Text link — underline only
        link: "text-primary underline-offset-4 hover:underline tracking-wider",
      },
      size: {
        // Standard — most buttons
        default: "h-9 gap-2 px-4 text-sm",
        xs:      "h-6 gap-1 px-2 text-xs",
        sm:      "h-7 gap-1 px-3 text-xs",
        // Punch-in — the LOG SESSION CTA. Full presence. Anton stamped.
        lg:      "h-14 gap-3 px-6 text-base",
        icon:    "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-ink text-white hover:bg-zinc-800 shadow-sm",
        variant === "secondary" && "border border-line bg-white text-ink hover:bg-mist shadow-sm",
        variant === "ghost" && "text-zinc-600 hover:text-ink hover:bg-mist",
        className
      )}
      {...props}
    />
  );
}

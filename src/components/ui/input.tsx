import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border border-line bg-white px-3 text-sm text-ink shadow-sm outline-none transition-shadow placeholder:text-zinc-400 hover:border-zinc-300 focus:border-ink focus:ring-1 focus:ring-ink",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-md border border-line bg-white px-3 text-sm text-ink shadow-sm outline-none transition-shadow hover:border-zinc-300 focus:border-ink focus:ring-1 focus:ring-ink",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[100px] w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink shadow-sm outline-none transition-shadow placeholder:text-zinc-400 hover:border-zinc-300 focus:border-ink focus:ring-1 focus:ring-ink",
        className
      )}
      {...props}
    />
  );
}

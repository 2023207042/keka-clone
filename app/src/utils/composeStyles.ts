import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Keep the old name for backward compatibility if needed, or refactor all usages.
// The plan is to use `cn` which is standard, but `composeStyles` is currently used.
export const composeStyles = cn;

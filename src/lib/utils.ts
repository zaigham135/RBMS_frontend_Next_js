import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    return format(parseISO(dateStr), "MMM dd, yyyy");
  } catch {
    return dateStr;
  }
}

export function toApiDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && error !== null) {
    // Handle Axios errors
    if ("response" in error) {
      const axiosError = error as { 
        response?: { 
          status?: number;
          data?: { 
            message?: string;
            status?: string;
          } 
        } 
      };
      
      const status = axiosError.response?.status;
      const data = axiosError.response?.data;
      
      if (status === 404) {
        return "User not found. Please check your credentials.";
      }
      if (status === 400) {
        return data?.message || "Invalid request. Please check your input.";
      }
      if (status === 401) {
        return "Invalid email or password. Please try again.";
      }
      if (status === 500) {
        return "Server error. Please try again later.";
      }
      if (data?.message) {
        return data.message;
      }
      return `Server error (${status}). Please try again.`;
    }
    
    // Handle Error instances
    if (error instanceof Error) {
      return error.message;
    }
  }
  
  // Handle string errors
  if (typeof error === "string") {
    return error;
  }
  
  return "An unexpected error occurred. Please try again.";
}

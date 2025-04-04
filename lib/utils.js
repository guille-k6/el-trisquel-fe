import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDateToString(dateString){
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

export function formatDateForInput(dateString) {
  try {
    const date = new Date(dateString); // Parse the ISO string
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Adjust for timezone
    return date.toISOString().split("T")[0]; // Extract "YYYY-MM-DD"
  } catch (e) {
    console.error("Error parsing date:", e);
    return "";
  }
}
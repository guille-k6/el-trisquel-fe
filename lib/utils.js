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
  try{
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Extracts YYYY-MM-DD
  } catch (e) {
    return '';
  }
}
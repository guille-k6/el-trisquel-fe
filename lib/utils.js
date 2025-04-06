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
  const [year, month, day] = dateString.split('-');
  return `${parseInt(day)}/${parseInt(month)}/${year}`;
}

export function formatDateForInput(dateString) {
  try {
    const [year, month, day] = dateString.split('-');
    return `${year}-${month}-${day}`;
  } catch (e) {
    return "";
  }
}

export function getTodayDateForInput(){
  const newDate = new Date(Date.now());
  let day = newDate.getDate();
  let month = newDate.getMonth() + 1;
  const year = newDate.getFullYear();
  if(day < 10){
    day = '0' + day;
  }
  if(month < 10){
    month = '0' + month;
  }
  return `${year}-${month}-${day}`;
}
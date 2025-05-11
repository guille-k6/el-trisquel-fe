import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price, currency) {
  let formattedCurrency = price;
  if(!currency){
    return formattedCurrency;
  }
  try{
    formattedCurrency = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price)
  } catch (e) {
    console.log("error formatting currency");
    console.log(e);
    return price;
  }
  return formattedCurrency;
}

export function formatDateToString(dateString){
  if(!dateString){
    return ""
  }
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
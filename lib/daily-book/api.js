import { commonErrorHandling } from "../api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const DAILY_BOOK_ROUTE = '/daily-book';
const DAILY_BOOK_ITEM_ROUTE = '/daily-book-item';

export async function fetchDailyBooks() {
  const res = await fetch(API_BASE_URL + DAILY_BOOK_ROUTE, {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchDailyBookById(id) {
  const res = await fetch(API_BASE_URL + DAILY_BOOK_ROUTE + "/" + id, {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

/**
 * This function does not handle errors, just throws them. Error handling must be at component level.
 * @param {*} product
 * @returns the product created or throws an Error.
 */
export async function postNewDailyBook(product) {
  const res = await fetch(API_BASE_URL + DAILY_BOOK_ROUTE, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(product),
    cache: "no-store",
  })
  await commonErrorHandling(res)
}

/**
 * This function does not handle errors, just throws them. Error handling must be at component level.
 * @param {*} product
 * @returns the jsonResponse.
 */
export async function deleteDailyBook(id) {
  const res = await fetch(API_BASE_URL + DAILY_BOOK_ROUTE + "/" + id, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
  })
  await commonErrorHandling(res)
}

export async function fetchLatestVoucherNumber(){
  const res = await fetch(API_BASE_URL + DAILY_BOOK_ITEM_ROUTE + "/" + "latestVoucherNumber", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
  })
  await commonErrorHandling(res)
  const jsonResponse = await res.json();
  return jsonResponse.latestVoucherNumber;
}

export async function fetchLatestXVoucher(){
  const res = await fetch(API_BASE_URL + DAILY_BOOK_ITEM_ROUTE + "/" + "latestXVoucher", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
  })
  await commonErrorHandling(res)
  const jsonResponse = await res.json();
  return jsonResponse.latestXVoucher;
}

export async function fetchInvoiceableDailyBookItems(page, size, dateFrom, dateTo, clientId) {
  let url = API_BASE_URL + DAILY_BOOK_ITEM_ROUTE + "/" + "invoiceableDailyBookItems";
  if( !!page || !!size || !!clientId || !!dateFrom || !!dateTo) {
    url += "?";
    if(!!page){
      url += `page=${page}&`;
    }
    if(!!size){
      url += `size=${size}&`;
    }
    if(!!dateFrom){
      url += `dateFrom=${dateFrom}&`;
    }
    if(!!dateTo){
      url += `dateTo=${dateTo}&`;
    }
    if(!!clientId){
      url += `clientId=${clientId}&`;
    }
  }
  url = url.replace(/&$/, ""); // Remove trailing '&' if exists
  url = url.replace(/\?$/, ""); // Remove trailing '?' if exists
  console.log(url);
  
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json();
}

export async function fetchDailyBookItemsInIds(ids){
  const res = await fetch(API_BASE_URL + DAILY_BOOK_ITEM_ROUTE + "/" + "items?ids=" + ids, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json();
}
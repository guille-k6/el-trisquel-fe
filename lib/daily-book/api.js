import { commonErrorHandling } from "../api"
import { authedFetch } from "../http/with-auth-cookie"

const DAILY_BOOK_ROUTE = '/daily-book';
const DAILY_BOOK_ITEM_ROUTE = '/daily-book-item';

export async function fetchDailyBooks(page, filters = {}) {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
  );
  const params = new URLSearchParams({
    page: page,
    ...cleanFilters,
  });
  const res = await authedFetch(DAILY_BOOK_ROUTE + "?" + params.toString(), {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchDailyBookById(id) {
  const res = await authedFetch(DAILY_BOOK_ROUTE + "/" + id, {
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
  const res = await authedFetch(DAILY_BOOK_ROUTE, {
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
  const res = await authedFetch(DAILY_BOOK_ROUTE + "/" + id, {
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
  const res = await authedFetch(DAILY_BOOK_ITEM_ROUTE + "/" + "latestVoucherNumber", {
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
  const res = await authedFetch(DAILY_BOOK_ITEM_ROUTE + "/" + "latestXVoucher", {
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

export async function fetchInvoiceableDailyBookItems(page, filters = {}) {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
  );
  const params = new URLSearchParams({
    page: page,
    ...cleanFilters,
  });
  
  const res = await authedFetch(DAILY_BOOK_ITEM_ROUTE + "/invoiceableDailyBookItems" + "?" + params.toString(), {
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
  const res = await authedFetch(DAILY_BOOK_ITEM_ROUTE + "/" + "items?ids=" + ids, {
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
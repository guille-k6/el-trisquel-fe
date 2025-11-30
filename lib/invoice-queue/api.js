import { commonErrorHandling } from "../api"
import { authedFetch } from "../http/with-auth-cookie"

const INVOICE_QUEUE_ROUTE = '/invoice-queue';

export async function fetchInvoiceQueuesOrdered(page, filters = {}) {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
  );
  const params = new URLSearchParams({
    page: page,
    ...cleanFilters,
  });
  
  const res = await authedFetch(INVOICE_QUEUE_ROUTE + "?" + params.toString(), {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchInvoiceQueueById(id) {
  const res = await authedFetch(`${INVOICE_QUEUE_ROUTE}/${id}`, {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchInvoiceQueueByInvoiceId(id) {
  const res = await authedFetch(`${INVOICE_QUEUE_ROUTE}/invoice/${id}`, {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}
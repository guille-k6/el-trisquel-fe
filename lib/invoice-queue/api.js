import { commonErrorHandling } from "../api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const INVOICE_QUEUE_ROUTE = '/invoice-queue';

export async function fetchInvoiceQueuesOrdered(page, filters = {}) {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
  );
  const params = new URLSearchParams({
    page: page,
    ...cleanFilters,
  });

  console.log(`Fetching invoice queues with params: ${params.toString()}`);
  
  
  const res = await fetch(API_BASE_URL + INVOICE_QUEUE_ROUTE + "?" + params.toString(), {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchInvoiceQueueById(id) {
  const res = await fetch(`${API_BASE_URL}${INVOICE_QUEUE_ROUTE}/${id}`, {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}
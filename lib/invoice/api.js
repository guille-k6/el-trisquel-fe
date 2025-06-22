import { commonErrorHandling } from "../api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const INVOICE_ROUTE = '/invoice';

export async function processNewInvoice(invoiceDTO){
  const res = await fetch(API_BASE_URL + INVOICE_ROUTE + "/new", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(invoiceDTO),
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json();
}
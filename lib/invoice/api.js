import { commonErrorHandling } from "../api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const INVOICE_ROUTE = '/invoice';
const INVOICE_PRINTER_ROUTE = '/invoice_printer';

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
}

export async function fetchInvoices(page, filters = {}) {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
  );
  const params = new URLSearchParams({
    page: page,
    ...cleanFilters,
  });
  
  const res = await fetch(API_BASE_URL + INVOICE_ROUTE + "?" + params.toString(), {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchInvoiceById(id) {
  const res = await fetch(API_BASE_URL + INVOICE_ROUTE + "/" + id, {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchSuggestedPrices(clientId, productId) {
  const res = await fetch(API_BASE_URL + INVOICE_ROUTE + "/suggest-prices/" + clientId + "/" + productId, {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

export async function openInvoicePdf(id) {
  try {
    const res = await fetch(API_BASE_URL + INVOICE_PRINTER_ROUTE + "/" + id, {
      headers: {
        Accept: "application/pdf",
      },
      cache: "no-store",
    });
    
    // Handle errors manually instead of using commonErrorHandling
    if (!res.ok) {
      throw new Error(`Failed to fetch PDF: ${res.status} ${res.statusText}`);
    }
    
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    
    window.open(url, '_blank');
    
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error('Error opening invoice PDF:', error);
    throw error;
  }
}


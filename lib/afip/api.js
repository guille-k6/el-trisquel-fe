import { commonErrorHandling } from "../api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const AFIP_ROUTE = '/afip';

export async function fetchTipoComprobantes() {
  const res = await fetch(API_BASE_URL + AFIP_ROUTE + "/tipo-comprobante", {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchMonedas() {
    const res = await fetch(API_BASE_URL + AFIP_ROUTE + "/moneda", {
      cache: "no-store",
    })
    await commonErrorHandling(res)
    return await res.json()
}

export async function fetchConceptos() {
    const res = await fetch(API_BASE_URL + AFIP_ROUTE + "/concepto", {
      cache: "no-store",
    })
    await commonErrorHandling(res)
    return await res.json()
}

export async function fetchIvas() {
    const res = await fetch(API_BASE_URL + AFIP_ROUTE + "/iva", {
      cache: "no-store",
    })
    await commonErrorHandling(res)
    return await res.json()
}

export async function fetchTiposDocumento() {
    const res = await fetch(API_BASE_URL + AFIP_ROUTE + "/tipo-documento", {
      cache: "no-store",
    })
    await commonErrorHandling(res)
    return await res.json()
}

export async function fetchIvaConditions() {
  const res = await fetch(API_BASE_URL + AFIP_ROUTE + "/condicion-iva", {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchSellConditions() {
  const res = await fetch(API_BASE_URL + AFIP_ROUTE + "/condicion-venta", {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

  
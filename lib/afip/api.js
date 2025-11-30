import { commonErrorHandling } from "../api"
import { authedFetch } from "../http/with-auth-cookie"

const AFIP_ROUTE = '/afip';

export async function fetchTipoComprobantes() {
  const res = await authedFetch(AFIP_ROUTE + "/tipo-comprobante")
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchMonedas() {
    const res = await authedFetch(AFIP_ROUTE + "/moneda", {
      cache: "no-store",
    })
    await commonErrorHandling(res)
    return await res.json()
}

export async function fetchConceptos() {
    const res = await authedFetch(AFIP_ROUTE + "/concepto", {
      cache: "no-store",
    })
    await commonErrorHandling(res)
    return await res.json()
}

export async function fetchIvas() {
    const res = await authedFetch(AFIP_ROUTE + "/iva")
    await commonErrorHandling(res)
    return await res.json()
}

export async function fetchTiposDocumento() {
    const res = await authedFetch(AFIP_ROUTE + "/tipo-documento")
    await commonErrorHandling(res)
    return await res.json()
}

export async function fetchIvaConditions() {
  const res = await authedFetch(AFIP_ROUTE + "/condicion-iva")
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchSellConditions() {
  const res = await authedFetch(AFIP_ROUTE + "/condicion-venta")
  await commonErrorHandling(res)
  return await res.json()
}

  
import { commonErrorHandling } from "../api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const PROVIDERS_ROUTE = '/nitrogen_provider';

export async function fetchProviders() {
  const res = await fetch(API_BASE_URL + PROVIDERS_ROUTE, {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchProvidersForCombo() {
  const res = await fetch(API_BASE_URL + PROVIDERS_ROUTE + '/combo', {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}
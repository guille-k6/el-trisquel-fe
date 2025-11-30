import { commonErrorHandling } from "../api"
import { authedFetch } from "../http/with-auth-cookie"

const PROVIDERS_ROUTE = '/nitrogen_provider';

export async function fetchProviders() {
  const res = await authedFetch(PROVIDERS_ROUTE)
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchProvidersForCombo() {
  const res = await authedFetch(PROVIDERS_ROUTE + '/combo')
  await commonErrorHandling(res)
  return await res.json()
}
import { commonErrorHandling } from "../api"
import { authedFetch } from "../http/with-auth-cookie"

const CONFIGURATION_ROUTE = '/configuration';

export async function getConfiguration(key) {
  const res = await authedFetch(CONFIGURATION_ROUTE + "/" + key, {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

export async function saveConfiguration(configuration) {
  const res = await authedFetch(CONFIGURATION_ROUTE, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(configuration),
    cache: "no-store",
  })
  await commonErrorHandling(res)
}
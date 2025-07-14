import { commonErrorHandling } from "../api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const CONFIGURATION_ROUTE = '/configuration';

export async function getConfiguration(key) {
  const res = await fetch(API_BASE_URL + CONFIGURATION_ROUTE + "/" + key, {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

export async function saveConfiguration(configuration) {
  const res = await fetch(API_BASE_URL + CONFIGURATION_ROUTE, {
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
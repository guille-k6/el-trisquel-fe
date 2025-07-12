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
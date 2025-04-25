import { commonErrorHandling } from "../api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function fetchClients() {
  const res = await fetch(API_BASE_URL + "/clients", {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchClientById(id) {
  const res = await fetch(API_BASE_URL + "/clients/" + id, {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

/**
 * This function does not handle errors, just throws them. Error handling must be at component level.
 * @param {*} client
 * @returns the client created or throws an Error.
 */
export async function postNewClient(client) {
  const res = await fetch(API_BASE_URL + "/clients", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(client),
    cache: "no-store",
  })
  await commonErrorHandling(res)
}

/**
 * This function does not handle errors, just throws them. Error handling must be at component level.
 * @param {*} client
 * @returns the jsonResponse.
 */
export async function deleteClient(id) {
  const res = await fetch(API_BASE_URL + "/clients/" + id, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
  })
  await commonErrorHandling(res)
}
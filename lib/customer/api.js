import { commonErrorHandling } from "../api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const CLIENTS_ROUTE = '/clients';

export async function fetchClients(page, filters = {}) {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
  );
  const params = new URLSearchParams({
    page: page,
    ...cleanFilters,
  });
  const res = await fetch(API_BASE_URL + CLIENTS_ROUTE + "?" + params.toString(), {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchClientsForCombo() {
  const res = await fetch(API_BASE_URL + CLIENTS_ROUTE + "/combo", {
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
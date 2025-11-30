import { commonErrorHandling } from "../api"
import { authedFetch } from "../http/with-auth-cookie"

const CLIENTS_ROUTE = '/clients';

export async function fetchClients(page, filters = {}) {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
  );
  const params = new URLSearchParams({
    page: page,
    ...cleanFilters,
  });
  const res = await authedFetch(CLIENTS_ROUTE + "?" + params.toString(), {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchClientsForCombo() {
  const res = await authedFetch(CLIENTS_ROUTE + "/combo", {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchClientById(id) {
  const res = await authedFetch(CLIENTS_ROUTE + "/" + id, {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

export async function postNewClient(client) {
  const res = await authedFetch(CLIENTS_ROUTE, {
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
  const res = await authedFetch(CLIENTS_ROUTE + "/" + id, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
  })
  await commonErrorHandling(res)
}
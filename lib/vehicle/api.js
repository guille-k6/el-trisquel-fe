import { commonErrorHandling } from "../api"
import { authedFetch } from "../http/with-auth-cookie"

export async function fetchVehicles() {
  const res = await authedFetch("/vehicles")
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchVehiclesForCombo() {
  const res = await authedFetch("/vehicles/combo")
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchVehicleById(id) {
  const res = await authedFetch(`/vehicles/${id}`)
  await commonErrorHandling(res)
  return await res.json()
}

export async function postNewVehicle(vehicle) {
  const res = await authedFetch("/vehicles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(vehicle),
  })
  await commonErrorHandling(res)
}

export async function deleteVehicle(id) {
  const res = await authedFetch(`/vehicles/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
  await commonErrorHandling(res)
}

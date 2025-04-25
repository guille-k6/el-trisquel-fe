import { commonErrorHandling } from "../api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchVehicles() {
  const res = await fetch(API_BASE_URL + "/vehicles", {
    cache: "no-store",
  });
  await commonErrorHandling(res);
  return await res.json();
}

export async function fetchVehiclesForCombo() {
  const res = await fetch(API_BASE_URL + "/vehicles");
  await commonErrorHandling(res);
  return await res.json();
}

export async function fetchVehicleById(id) {
  const res = await fetch(API_BASE_URL + "/vehicles/" + id, {
    cache: "no-store",
  });
  await commonErrorHandling(res);
  return await res.json();
}

/**
 * This function does not handle errors, just throws them. Error handling must be at component level.
 * @param {*} vehicle 
 * @returns the vehicle created or throws an Error.
 */
export async function postNewVehicle(vehicle) {  
  const res = await fetch(API_BASE_URL + "/vehicles", {
    method: 'POST',
    headers: {
      "Content-type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(vehicle),
    cache: "no-store",
  });
  await commonErrorHandling(res);  
}

/**
 * This function does not handle errors, just throws them. Error handling must be at component level.
 * @param {*} vehicle 
 * @returns the jsonResponse.
 */
export async function deleteVehicle(id) {
  const res = await fetch(API_BASE_URL + "/vehicles/" + id, {
    method: 'DELETE',
    headers: {
      "Content-type": "application/json",
      "Accept": "application/json",
    },
    cache: "no-store",
  });
  await commonErrorHandling(res);
}
import { commonErrorHandling } from "../api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function fetchProducts() {
  const res = await fetch(API_BASE_URL + "/products", {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchProductById(id) {
  const res = await fetch(API_BASE_URL + "/products/" + id, {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

/**
 * This function does not handle errors, just throws them. Error handling must be at component level.
 * @param {*} product
 * @returns the product created or throws an Error.
 */
export async function postNewProduct(product) {
  const res = await fetch(API_BASE_URL + "/products", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(product),
    cache: "no-store",
  })
  await commonErrorHandling(res)
}

/**
 * This function does not handle errors, just throws them. Error handling must be at component level.
 * @param {*} product
 * @returns the jsonResponse.
 */
export async function deleteProduct(id) {
  const res = await fetch(API_BASE_URL + "/products/" + id, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
  })
  commonErrorHandling(res)
}
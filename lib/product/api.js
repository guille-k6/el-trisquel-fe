import { commonErrorHandling } from "../api"
import { authedFetch } from "../http/with-auth-cookie";

const PRODUCTS_ROUTE = '/products';

export async function fetchProducts() {
  const res = await authedFetch(PRODUCTS_ROUTE)
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchProductsForCombo() {
  const res = await authedFetch(PRODUCTS_ROUTE + '/combo')
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchProductById(id) {
  const res = await authedFetch(PRODUCTS_ROUTE + "/" + id)
  await commonErrorHandling(res)
  return await res.json()
}

export async function postNewProduct(product) {
  const res = await authedFetch(PRODUCTS_ROUTE, {
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

export async function deleteProduct(id) {
  const res = await authedFetch(PRODUCTS_ROUTE + "/" + id, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
  })
  await commonErrorHandling(res)
}
import { commonErrorHandling } from "../api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const PRODUCTS_ROUTE = '/products';

export async function fetchProducts() {
  const res = await fetch(API_BASE_URL + PRODUCTS_ROUTE, {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchProductById(id) {
  console.log("entre al fetch");
  
  const res = await fetch(API_BASE_URL + PRODUCTS_ROUTE + "/" + id, {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

export async function postNewProduct(product) {
  const res = await fetch(API_BASE_URL + PRODUCTS_ROUTE, {
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
  const res = await fetch(API_BASE_URL + PRODUCTS_ROUTE + "/" + id, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
  })
  await commonErrorHandling(res)
}
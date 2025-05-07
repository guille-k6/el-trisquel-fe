import { commonErrorHandling } from "../api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function fetchVouchers() {
  const res = await fetch(API_BASE_URL + "/vouchers", {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchVouchersForCombo() {
  const res = await fetch(API_BASE_URL + "/vouchers")
  await commonErrorHandling(res)
  return await res.json()
}

export async function fetchVoucherById(id) {
  const res = await fetch(API_BASE_URL + "/vouchers/" + id, {
    cache: "no-store",
  })
  await commonErrorHandling(res)
  return await res.json()
}

/**
 * This function does not handle errors, just throws them. Error handling must be at component level.
 * @param {*} voucher
 * @returns the voucher created or throws an Error.
 */
export async function postNewVoucher(voucher) {
  const res = await fetch(API_BASE_URL + "/vouchers", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(voucher),
    cache: "no-store",
  })
  await commonErrorHandling(res)
}

/**
 * This function does not handle errors, just throws them. Error handling must be at component level.
 * @param {*} id
 * @returns the jsonResponse.
 */
export async function deleteVoucher(id) {
  const res = await fetch(API_BASE_URL + "/vouchers/" + id, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
  })
  await commonErrorHandling(res)
}

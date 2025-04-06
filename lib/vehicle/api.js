const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchVehicles() {
    try {
      const res = await fetch(API_BASE_URL + "/vehicles", {
        cache: "no-store",
      });
  
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
  
      return await res.json();
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
      throw error;
    }
}

export async function fetchVehicleById(id) {
    try {
      const res = await fetch(API_BASE_URL + "/vehicles/" + id, {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
  
      const jsonRes = await res.json();
      console.log(jsonRes);
      return jsonRes;
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
      throw error;
    }
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

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    if (errorData) {
      const error = new Error(`Error ${res.status}: ${res.statusText}`);
      error.status = res.status;
      error.data = errorData;
      throw error;
    } else {
      // Fallback to the basic error if we couldn't parse the response
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
  }
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

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    if (errorData) {
      const error = new Error(`Error ${res.status}: ${res.statusText}`);
      error.status = res.status;
      error.data = errorData;
      throw error;
    } else {
      // Fallback to the basic error if we couldn't parse the response
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
  }
}
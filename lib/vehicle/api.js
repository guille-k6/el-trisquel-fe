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
export async function commonErrorHandling(result) {
  if (!result.ok) {
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

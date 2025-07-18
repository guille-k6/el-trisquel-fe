export async function commonErrorHandling(result) {
  if (!result.ok) { 
    console.log("There was an error with the request:", result.status, result.statusText);
    
    const errorData = await result.json().catch(() => null);
    if (errorData) {
      console.log(errorData);
      
      const error = new Error(`Error ${result.status}: ${result.statusText}`);
      error.status = result.status;
      error.message = errorData;
      throw error;
    } else {
      // Fallback to the basic error if we couldn't parse the response
      throw new Error(`Error ${result.status}: ${result.statusText}`);
    }
  }
}

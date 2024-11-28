// utils.ts
export const postData = async (data: any) => {
    const url = "http://ec2-18-192-24-192.eu-central-1.compute.amazonaws.com:3030/predict";
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  };
  
  



  
  export const getPredictionResults = async () => {
  try {
    const response = await fetch(
      "http://ec2-18-192-24-192.eu-central-1.compute.amazonaws.com:3030/predict",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: (error as Error).message };
  }
};

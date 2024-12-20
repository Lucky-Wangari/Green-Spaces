// utils.ts
export const postData = async (data: { [k: number | string]: number| string; }) => {
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
      console.error("Error posting data:", (error as Error).message);
      throw error;
    }
  };
  

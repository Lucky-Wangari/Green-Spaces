// pages/api/predict.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const PREDICTION_API_URL = 'https://ec2-18-192-24-192.eu-central-1.compute.amazonaws.com:3030/predict'; // Use HTTPS

const predictHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      // Send a POST request to the external HTTPS prediction API
      const response = await fetch(PREDICTION_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body), // Pass the client data to the external API
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction from the external API');
      }

      const predictionData = await response.json();

      // Return the prediction data to the client
      res.status(200).json(predictionData);
    } catch (error) {
      console.error('Error in prediction API:', error);
      res.status(500).json({ error: 'Error processing your request' });
    }
  } else {
    // If not a POST request, return method not allowed
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default predictHandler;

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const getAIResponseFromGemini = async (query: string) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in environment variables.");
  }

  // Corrected API URL and model name
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

  const requestData = {
    contents: [
      {
        parts: [{ text: query }]
      }
    ]
  };

  try {
    console.log('Sending request to Gemini API:', query);

    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Received response from Gemini API:', JSON.stringify(response.data, null, 2));

    const textResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    return textResponse ? textResponse.trim() : "No response generated.";
  } catch (error: any) {
    console.error('Error getting AI response:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || "An error occurred while fetching AI response.");
  }
};

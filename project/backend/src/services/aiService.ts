import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const getAIResponseFromGemini = async (query: string, matches: any[]) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in environment variables.");
  }

  // Corrected API URL and model name
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

  const requestData = {
    contents: [
      {
        parts: [
          { text: `User query: ${query}\n\nDatabase matches: ${JSON.stringify(matches, null, 2)}\n\nProvide a suitable response based on the user query and database matches, using plain text formatting without asterisks (*).` }
        ]
      }
    ]
  };

  try {
    console.log('Sending request to Gemini API with:', JSON.stringify(requestData, null, 2));

    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Received response from Gemini API:', JSON.stringify(response.data, null, 2));

    // Extract the response text correctly
    let textResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";

    // Remove asterisks (*) from the response
    textResponse = textResponse.replace(/\*/g, '').trim();

    return textResponse;
  } catch (error: any) {
    console.error('Error getting AI response:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || "An error occurred while fetching AI response.");
  }
};

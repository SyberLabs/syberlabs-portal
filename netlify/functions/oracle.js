/**
 * SyberLabs Consciousness Oracle - Serverless Function
 *
 * Acts as a secure intermediary to the AI model API.
 * - Handles POST requests from the front-end widget.
 * - Injects the secret API key and the core system prompt from environment variables.
 * - Calls the AI model API.
 * - Streams the response back to the client in real-time.
 *
 * DEPLOYMENT:
 * - Place this file in your serverless functions directory (e.g., /netlify/functions/oracle.js).
 * - Set the following environment variables in your deployment environment:
 * - AI_API_KEY: Your secret key for the AI provider.
 * - ORACLE_SYSTEM_PROMPT: The full system prompt text provided in the project brief.
 */

// Using 'node-fetch' for compatibility in various Node.js environments.
// In modern environments like Deno or Cloudflare Workers, you can use the global `fetch`.
const fetch = require('node-fetch');

// The main handler for the serverless function.
exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }
  // 1. Ensure the request is a POST request.
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    // 2. Retrieve the user's message from the request body.
    const { message } = JSON.parse(event.body);
    if (!message) {
      return { statusCode: 400, body: 'Bad Request: Missing message.' };
    }

    // 3. Securely retrieve secrets from environment variables.
    const { AI_API_KEY, ORACLE_SYSTEM_PROMPT } = process.env;

    // The official API endpoint placeholder.
    const apiEndpoint = 'https://api.deepseek.com/chat/completions';

    // 4. Make the streaming API call to the AI model.
    const aiResponse = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // Or any other specified model
        messages: [
          {
            role: 'system',
            content: ORACLE_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        // Set streaming and other parameters.
        stream: true,
        temperature: 0.5,
        max_tokens: 200, // As specified in the prompt
      }),
    });

    // 5. Stream the response directly back to the client.
    // This pipes the data from the AI endpoint to the front-end without waiting for the full response.
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
      body: aiResponse.body, // Pass the readable stream as the body.
      isBase64Encoded: false, // Important for streaming
    };

  } catch (error) {
    console.error('Oracle function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'The Oracle is currently unable to connect.' }),
    };
  }
};
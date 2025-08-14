// /netlify/functions/oracle.js

const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message } = JSON.parse(event.body);
    const { AI_API_KEY, ORACLE_SYSTEM_PROMPT } = process.env;

    // Check if the environment variables are set
    if (!AI_API_KEY || !ORACLE_SYSTEM_PROMPT) {
      console.error('Server misconfiguration: Missing environment variables.');
      throw new Error('Server misconfiguration.');
    }

    const apiEndpoint = 'https://api.deepseek.com/chat/completions';

    const aiResponse = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: ORACLE_SYSTEM_PROMPT },
          { role: 'user', content: message },
        ],
        stream: true,
        temperature: 0.5,
        max_tokens: 200,
      }),
    });

    // THIS IS THE CRUCIAL NEW BLOCK
    // It checks if the call to the AI API was successful before proceeding.
    if (!aiResponse.ok) {
      const errorBody = await aiResponse.text();
      console.error(`AI API Error: ${aiResponse.status} ${aiResponse.statusText}`, errorBody);
      throw new Error('Failed to get a valid response from the AI service.');
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
      body: aiResponse.body,
      isBase64Encoded: false,
    };

  } catch (error) {
    console.error('Oracle function execution error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'The Oracle encountered an internal error.' }),
    };
  }
};
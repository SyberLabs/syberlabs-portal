// /netlify/functions/oracle.js - FINAL (Non-Streaming Version)

const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message } = JSON.parse(event.body);
    const { AI_API_KEY, ORACLE_SYSTEM_PROMPT } = process.env;

    if (!AI_API_KEY || !ORACLE_SYSTEM_PROMPT) {
      throw new Error('Server misconfiguration: Missing environment variables.');
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
        stream: false, // KEY CHANGE: We are no longer requesting a stream
        temperature: 0.5,
        max_tokens: 1500,
      }),
    });

    if (!aiResponse.ok) {
      const errorBody = await aiResponse.text();
      console.error(`AI API Error: ${aiResponse.status} ${aiResponse.statusText}`, errorBody);
      throw new Error('Failed to get a valid response from the AI service.');
    }

    // Get the JSON data directly
    const data = await aiResponse.json();
    const messageContent = data.choices[0].message.content;

    // Return a simple JSON response
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response: messageContent }),
    };

  } catch (error) {
    console.error('Oracle function execution error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'The Oracle encountered an internal error.' }),
    };
  }
};
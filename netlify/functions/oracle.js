// /netlify/functions/oracle.js - CORRECTED VERSION

const fetch = require('node-fetch');
// The 'stream' module is no longer needed
// const { Readable } = require('stream');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message } = JSON.parse(event.body);
    const { AI_API_KEY, ORACLE_SYSTEM_PROMPT } = process.env;

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

    if (!aiResponse.ok) {
      const errorBody = await aiResponse.text();
      console.error(`AI API Error: ${aiResponse.status} ${aiResponse.statusText}`, errorBody);
      throw new Error('Failed to get a valid response from the AI service.');
    }
    
    // 💡 FIX: Return a standards-compliant Response object.
    // This allows Netlify to correctly handle the stream from the DeepSeek API 
    // and pipe it to your frontend client.
    return new Response(aiResponse.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Oracle function execution error:', error.message);
    // Return a standard response object for errors
    return new Response(JSON.stringify({ error: 'The Oracle encountered an internal error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
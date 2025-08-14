// /netlify/functions/oracle.js - Correct Back-End Diagnostic Logic

const fetch = require('node-fetch');

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

        const rawBodyText = await aiResponse.text();
        console.log("--- RAW AI RESPONSE BODY ---");
        console.log(rawBodyText);
        console.log("--- END RAW AI RESPONSE BODY ---");

        if (!aiResponse.ok) {
            console.error(`AI API Error Status: ${aiResponse.status} ${aiResponse.statusText}`);
            throw new Error('AI service returned an error status.');
        }
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'text/plain' },
            body: `This is a test. The raw response was logged to the function console.`,
        };

    } catch (error) {
        console.error('Oracle function execution error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'The Oracle encountered an internal error.' }),
        };
    }
};
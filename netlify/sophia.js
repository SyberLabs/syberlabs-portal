// /netlify/sophia.js - Logic for the ephemeral interface on sophia.html

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CONFIGURATION ---
    const API_ENDPOINT = '/.netlify/functions/oracle';

    // --- 2. DOM ELEMENT SELECTION ---
    const summonButton = document.getElementById('summon-button');
    const promptContainer = document.getElementById('prompt-container');
    const inputForm = document.getElementById('oracle-input-form');
    const userInput = document.getElementById('oracle-user-input');
    const responseContainer = document.getElementById('response-container');
    const responseText = document.getElementById('response-text');
    const dismissButton = document.getElementById('dismiss-button');
    const historyButton = document.getElementById('history-log-button');
    const historyPanel = document.getElementById('history-log-panel');
    const historyCloseButton = document.getElementById('history-log-close');
    const historyContent = document.getElementById('history-log-content');

    // --- 3. STATE MANAGEMENT ---
    let isSophiaActive = false;

    // --- 4. PRIMARY EVENT HANDLERS ---
    if (summonButton) {
        summonButton.addEventListener('click', () => {
            if (!isSophiaActive) {
                hideSummonButton();
                showPrompt();
            }
        });
    }
    
    if (inputForm) {
        inputForm.addEventListener('submit', handleFormSubmit);
    }
    
    if (dismissButton) {
        dismissButton.addEventListener('click', hideResponse);
    }

    if (historyButton && historyPanel) {
        historyButton.addEventListener('click', () => historyPanel.classList.toggle('hidden'));
    }

    if (historyCloseButton && historyPanel) {
        historyCloseButton.addEventListener('click', () => historyPanel.classList.add('hidden'));
    }

    // --- 5. CORE LOGIC ---
    async function handleFormSubmit(e) {
        e.preventDefault();
        if (isSophiaActive) return;
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        isSophiaActive = true;
        hidePrompt();
        userInput.value = '';
        showResponse('Sophia is contemplating...');

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
                    stream: true, // We are still requesting a stream
                    temperature: 0.5,
                    max_tokens: 200,
                }),
            });

            // --- TEMPORARY DIAGNOSTIC CODE ---
            // We will capture the entire response body as text first.
            const rawBodyText = await aiResponse.text();

            // We will print this raw text to the function log.
            console.log("--- RAW AI RESPONSE BODY ---");
            console.log(rawBodyText);
            console.log("--- END RAW AI RESPONSE BODY ---");

            if (!aiResponse.ok) {
                console.error(`AI API Error Status: ${aiResponse.status} ${aiResponse.statusText}`);
                throw new Error('AI service returned an error status.');
            }
            
            // For this test, we return the captured text instead of the original stream.
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'text/plain' },
                body: `This is a test. The raw response was logged to the function console.`,
            };
            // --- END DIAGNOSTIC CODE ---

        } catch (error) {
            console.error('Oracle function execution error:', error.message);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'The Oracle encountered an internal error.' }),
            };
        }    
    }

    async function processStream(response) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let completeResponse = '';
        responseText.textContent = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.substring(6);
                    if (data.trim() === '[DONE]') break;
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices[0]?.delta?.content || '';
                        if (content) {
                            completeResponse += content;
                            responseText.textContent = completeResponse;
                        }
                    } catch (e) { /* Ignore */ }
                }
            }
        }
        return completeResponse;
    }
    
    // --- 6. HELPER & UI FUNCTIONS ---
    function showSummonButton() { if (summonButton) summonButton.classList.remove('hidden'); }
    function hideSummonButton() { if (summonButton) summonButton.classList.add('hidden'); }
    function showPrompt() {
        if (promptContainer) {
            promptContainer.classList.add('visible');
            userInput.focus();
        }
    }
    function hidePrompt() { if (promptContainer) promptContainer.classList.remove('visible'); }
    function showResponse(text) {
        if (responseText) {
            responseText.textContent = text;
            responseContainer.classList.add('visible');
        }
    }
    function hideResponse() {
        if (responseContainer) responseContainer.classList.remove('visible');
        showSummonButton();
        isSophiaActive = false;
    }
    function appendToHistory(speaker, text) {
        if (!historyContent) return;
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('log-entry', speaker);
        const speakerStrong = document.createElement('strong');
        speakerStrong.textContent = speaker === 'user' ? 'You:' : 'Sophia:';
        const textNode = document.createTextNode(text);
        entryDiv.appendChild(speakerStrong);
        entryDiv.appendChild(textNode);
        historyContent.appendChild(entryDiv);
        historyContent.scrollTop = historyContent.scrollHeight;
    }
});
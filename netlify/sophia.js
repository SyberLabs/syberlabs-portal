// /netlify/sophia.js - Correct Front-End Logic

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
            // THIS IS THE CORRECT FETCH CALL
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            });
            if (!response.ok) throw new Error('Connection to Sophia has been lost.');
            
            // This part is for the diagnostic test. The response will not stream.
            const diagnosticText = await response.text();
            console.log("Response from server:", diagnosticText);
            showResponse("Test complete. Check the Netlify function logs for the raw AI response.");

        } catch (error) {
            console.error('SyberSophia Error:', error);
            showResponse(error.message);
        }
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
        // This function will be used later when we restore streaming
    }
});
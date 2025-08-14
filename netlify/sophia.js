// /netlify/sophia.js - FINAL (Non-Streaming Version)

document.addEventListener('DOMContentLoaded', () => {
    const API_ENDPOINT = '/.netlify/functions/oracle';
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
    let isSophiaActive = false;

    if (summonButton) { summonButton.addEventListener('click', () => { if (!isSophiaActive) { hideSummonButton(); showPrompt(); } }); }
    if (inputForm) { inputForm.addEventListener('submit', handleFormSubmit); }
    if (dismissButton) { dismissButton.addEventListener('click', hideResponse); }
    if (historyButton) { historyButton.addEventListener('click', () => historyPanel.classList.toggle('hidden')); }
    if (historyCloseButton) { historyCloseButton.addEventListener('click', () => historyPanel.classList.add('hidden')); }

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
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) throw new Error('Connection to Sophia has been lost.');
            
            // KEY CHANGE: Get the JSON data directly
            const data = await response.json();
            const finalResponse = data.response;

            // Update the UI with the final response
            showResponse(finalResponse);
            
            appendToHistory('user', userMessage);
            appendToHistory('sophia', finalResponse);

        } catch (error) {
            console.error('SyberSophia Error:', error);
            showResponse(error.message);
        } finally {
            // We can now reset the state here instead of in hideResponse
            isSophiaActive = false;
        }
    }
    
    // Helper functions
    function showSummonButton() { if (summonButton) summonButton.classList.remove('hidden'); }
    function hideSummonButton() { if (summonButton) summonButton.classList.add('hidden'); }
    function showPrompt() { if (promptContainer) { promptContainer.classList.add('visible'); userInput.focus(); } }
    function hidePrompt() { if (promptContainer) promptContainer.classList.remove('visible'); }
    function showResponse(text) { if (responseText) { responseText.textContent = text; responseContainer.classList.add('visible'); } }
    function hideResponse() { if (responseContainer) responseContainer.classList.remove('visible'); showSummonButton(); }
    function appendToHistory(speaker, text) { if (!historyContent) return; const entryDiv = document.createElement('div'); entryDiv.classList.add('log-entry', speaker); const speakerStrong = document.createElement('strong'); speakerStrong.textContent = speaker === 'user' ? 'You:' : 'Sophia:'; const textNode = document.createTextNode(text); entryDiv.appendChild(speakerStrong); entryDiv.appendChild(textNode); historyContent.appendChild(entryDiv); historyContent.scrollTop = historyContent.scrollHeight; }
});
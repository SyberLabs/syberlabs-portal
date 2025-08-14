// /netlify/sophia.js - FINAL with Markdown Parsing

document.addEventListener('DOMContentLoaded', () => {
    // ... (Configuration and DOM Selection are the same) ...
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

    // ... (Event Handlers are the same) ...
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
            
            const data = await response.json();
            const finalResponse = data.response;

            showResponse(finalResponse);
            
            appendToHistory('user', userMessage);
            appendToHistory('sophia', finalResponse);

        } catch (error) {
            console.error('SyberSophia Error:', error);
            showResponse(error.message);
        } finally {
            isSophiaActive = false;
        }
    }
    
    // --- Helper & UI Functions ---

    // NEW FUNCTION: Converts simple markdown to HTML
    function parseMarkdown(text) {
        // Convert **bold** to <strong>bold</strong>
        let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Convert *italics* to <em>italics</em>
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Convert newlines to <br> tags for line breaks
        html = html.replace(/\n/g, '<br>');
        return html;
    }

    function showSummonButton() { if (summonButton) summonButton.classList.remove('hidden'); }
    function hideSummonButton() { if (summonButton) summonButton.classList.add('hidden'); }
    function showPrompt() { if (promptContainer) { promptContainer.classList.add('visible'); userInput.focus(); } }
    function hidePrompt() { if (promptContainer) promptContainer.classList.remove('visible'); }
    
    function showResponse(text) {
        if (responseText) {
            // KEY CHANGE: Use innerHTML and the parser to render formatting
            responseText.innerHTML = parseMarkdown(text);
            responseContainer.classList.add('visible');
        }
    }

    function hideResponse() { if (responseContainer) responseContainer.classList.remove('visible'); showSummonButton(); }
    
    function appendToHistory(speaker, text) { 
        if (!historyContent) return; 
        const entryDiv = document.createElement('div'); 
        entryDiv.classList.add('log-entry', speaker); 
        const speakerStrong = document.createElement('strong'); 
        speakerStrong.textContent = speaker === 'user' ? 'You:' : 'Sophia:';
        
        // Use innerHTML for the response part in the log as well
        const textSpan = document.createElement('span');
        if (speaker === 'sophia') {
            textSpan.innerHTML = parseMarkdown(text);
        } else {
            textSpan.textContent = text;
        }

        entryDiv.appendChild(speakerStrong); 
        entryDiv.appendChild(textSpan);
        historyContent.appendChild(entryDiv); 
        historyContent.scrollTop = historyContent.scrollHeight; 
    }
});
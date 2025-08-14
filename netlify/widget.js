// /netlify/widget.js - Final polished logic for the pop-up widget on index.html

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Widget DOM Element Selection ---
    const toggleButton = document.getElementById('oracle-toggle-button');
    const chatWindow = document.getElementById('oracle-chat-window');
    const messageDisplay = document.getElementById('oracle-message-display');
    const inputForm = document.getElementById('oracle-input-form');
    const userInput = document.getElementById('oracle-user-input');
    const oracleApiEndpoint = '/.netlify/functions/oracle';

    // --- 2. Widget Event Listeners ---
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleChatWindow);
    }

    if (inputForm) {
        inputForm.addEventListener('submit', handleWidgetSubmit);
    }

    // --- 3. Widget Core Functions ---
    function toggleChatWindow() {
        if (!chatWindow || !toggleButton) return;

        const isHidden = chatWindow.classList.toggle('oracle-hidden');

        // Change the button icon based on the window state
        if (isHidden) {
            toggleButton.innerHTML = '🌌';
        } else {
            toggleButton.innerHTML = '&times;'; // The 'X' symbol
        }
    }

    async function handleWidgetSubmit(e) {
        e.preventDefault();
        // ... (rest of the function is the same, no changes needed here) ...
        if (!userInput || !messageDisplay) return;
        const userMessageText = userInput.value.trim();
        if (!userMessageText) return;
        appendWidgetMessage(userMessageText, 'user-message');
        userInput.value = '';
        const oracleResponseElement = appendWidgetMessage('', 'oracle-response');
        const thinkingIndicator = showThinkingIndicator(oracleResponseElement);
        try {
            const response = await fetch(oracleApiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessageText }),
            });
            if (!response.ok) throw new Error('Connection error');
            await processWidgetStream(response, oracleResponseElement, thinkingIndicator);
        } catch (error) {
            console.error('SyberSophia Widget Error:', error);
            oracleResponseElement.textContent = "My apologies. I am unable to form a connection at this moment.";
            if (thinkingIndicator) hideThinkingIndicator(thinkingIndicator);
        }
    }

    async function processWidgetStream(response, targetElement, indicator) {
        // ... (this function is the same, no changes needed here) ...
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        if (indicator) hideThinkingIndicator(indicator);
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.substring(6);
                    if (data.trim() === '[DONE]') return;
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices[0]?.delta?.content || '';
                        if (content) {
                            targetElement.textContent += content;
                            if (messageDisplay) messageDisplay.scrollTop = messageDisplay.scrollHeight;
                        }
                    } catch (e) { /* Ignore */ }
                }
            }
        }
    }

    // --- 4. Widget Helper UI Functions ---
    // ... (These functions are the same, no changes needed here) ...
    function appendWidgetMessage(text, className) {
        if (!messageDisplay) return null;
        const messageElement = document.createElement('div');
        messageElement.className = `oracle-message ${className}`;
        messageElement.textContent = text;
        messageDisplay.appendChild(messageElement);
        messageDisplay.scrollTop = messageDisplay.scrollHeight;
        return messageElement;
    }
    function showThinkingIndicator(parentElement) {
        if (!parentElement) return null;
        const indicator = document.createElement('div');
        indicator.className = 'thinking-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        parentElement.appendChild(indicator);
        return indicator;
    }
    function hideThinkingIndicator(indicator) {
        if (indicator) indicator.remove();
    }
});
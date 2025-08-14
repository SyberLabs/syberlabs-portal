// /netlify/widget.js - FINAL with Markdown Parsing

document.addEventListener('DOMContentLoaded', () => {
    // ... (DOM Selection is the same) ...
    const toggleButton = document.getElementById('oracle-toggle-button');
    const chatWindow = document.getElementById('oracle-chat-window');
    const messageDisplay = document.getElementById('oracle-message-display');
    const inputForm = document.getElementById('oracle-input-form');
    const userInput = document.getElementById('oracle-user-input');
    const oracleApiEndpoint = '/.netlify/functions/oracle';

    // ... (Event Handlers are the same) ...
    if (toggleButton) { toggleButton.addEventListener('click', toggleChatWindow); }
    if (inputForm) { inputForm.addEventListener('submit', handleWidgetSubmit); }

    function toggleChatWindow() {
        if (!chatWindow || !toggleButton) return;
        const isHidden = chatWindow.classList.toggle('oracle-hidden');
        if (isHidden) {
            toggleButton.innerHTML = '🌌';
        } else {
            toggleButton.innerHTML = '&times;';
        }
    }

    async function handleWidgetSubmit(e) {
        e.preventDefault();
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

            const data = await response.json();
            const finalResponse = data.response;

            if (thinkingIndicator) hideThinkingIndicator(thinkingIndicator);
            
            // KEY CHANGE: Use innerHTML and the parser to render formatting
            oracleResponseElement.innerHTML = parseMarkdown(finalResponse);
            if (messageDisplay) messageDisplay.scrollTop = messageDisplay.scrollHeight;

        } catch (error) {
            console.error('SyberSophia Widget Error:', error);
            oracleResponseElement.textContent = "My apologies. I am unable to form a connection at this moment.";
            if (thinkingIndicator) hideThinkingIndicator(thinkingIndicator);
        }
    }

    // --- Helper UI Functions ---

    // NEW FUNCTION: Converts simple markdown to HTML
    function parseMarkdown(text) {
        let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/\n/g, '<br>');
        return html;
    }

    function appendWidgetMessage(text, className) {
        if (!messageDisplay) return null;
        const messageElement = document.createElement('div');
        messageElement.className = `oracle-message ${className}`;
        
        // Only parse markdown for Sophia's responses
        if (className === 'oracle-response') {
            messageElement.innerHTML = parseMarkdown(text);
        } else {
            messageElement.textContent = text;
        }

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
/**
 * SyberLabs Consciousness Oracle - Front-End Logic
 *
 * - Toggles the visibility of the chat widget.
 * - Handles user input submission.
 * - Sends the user's message to the serverless function backend.
 * - Receives and processes the streamed response in real-time.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DOM Element Selection ---
    const toggleButton = document.getElementById('oracle-toggle-button');
    const chatWindow = document.getElementById('oracle-chat-window');
    const messageDisplay = document.getElementById('oracle-message-display');
    const inputForm = document.getElementById('oracle-input-form');
    const userInput = document.getElementById('oracle-user-input');

    // The endpoint for our serverless function
    const oracleApiEndpoint = '/.netlify/functions/oracle'; // Adjust if your provider uses a different path, e.g., '/api/oracle' for Vercel

    // --- 2. Event Listeners ---
    toggleButton.addEventListener('click', toggleChatWindow);
    inputForm.addEventListener('submit', handleFormSubmit);

    // --- 3. Core Functions ---

    /**
     * Toggles the chat window's visibility.
     */
    function toggleChatWindow() {
        chatWindow.classList.toggle('oracle-hidden');
    }

    /**
     * Handles the user submitting a message.
     * @param {Event} e The form submission event.
     */
    async function handleFormSubmit(e) {
        e.preventDefault();
        const userMessageText = userInput.value.trim();

        if (!userMessageText) return;

        // Display user's message and clear the input field
        appendMessage(userMessageText, 'user-message');
        userInput.value = '';
        
        // Show the "thinking" indicator and prepare the Oracle's response bubble
        const oracleResponseElement = appendMessage('', 'oracle-response');
        const thinkingIndicator = showThinkingIndicator(oracleResponseElement);

        try {
            // Send the message to the backend function
            const response = await fetch(oracleApiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessageText }),
            });

            if (!response.ok) {
                throw new Error(`Oracle connection error: ${response.statusText}`);
            }

            // Process the streamed response
            await processStream(response, oracleResponseElement, thinkingIndicator);

        } catch (error) {
            console.error('Error fetching from Oracle:', error);
            oracleResponseElement.textContent = "My apologies. I am unable to form a connection at this moment.";
            hideThinkingIndicator(thinkingIndicator);
        }
    }

    /**
     * Reads the streamed response from the serverless function and updates the UI.
     * @param {Response} response The fetch response object.
     * @param {HTMLElement} targetElement The element to display the response in.
     * @param {HTMLElement} indicator The "thinking" indicator element.
     */
    async function processStream(response, targetElement, indicator) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        // Hide the indicator once we start receiving data.
        hideThinkingIndicator(indicator);

        // This loop reads the stream chunk by chunk
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            // Decode the chunk (Uint8Array) into a string
            buffer += decoder.decode(value, { stream: true });
            
            // AI responses (like OpenAI's) often send data in "data: {...}" chunks, separated by newlines.
            const lines = buffer.split('\n');
            buffer = lines.pop(); // Keep any partial line for the next chunk

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.substring(6);
                    if (data.trim() === '[DONE]') {
                        return; // Stream finished
                    }
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices[0]?.delta?.content || '';
                        if (content) {
                            targetElement.textContent += content;
                            // Auto-scroll to the bottom
                            messageDisplay.scrollTop = messageDisplay.scrollHeight;
                        }
                    } catch (e) {
                        // Ignore parsing errors for non-JSON lines
                    }
                }
            }
        }
    }

    // --- 4. Helper UI Functions ---

    /**
     * Appends a new message bubble to the chat display.
     * @param {string} text The message content.
     * @param {string} className The CSS class for styling ('user-message' or 'oracle-response').
     * @returns {HTMLElement} The created message element.
     */
    function appendMessage(text, className) {
        const messageElement = document.createElement('div');
        messageElement.className = `oracle-message ${className}`;
        messageElement.textContent = text;
        messageDisplay.appendChild(messageElement);
        messageDisplay.scrollTop = messageDisplay.scrollHeight;
        return messageElement;
    }

    /**
     * Creates and displays a "thinking" indicator.
     * @param {HTMLElement} parentElement The element to append the indicator to.
     * @returns {HTMLElement} The indicator element.
     */
    function showThinkingIndicator(parentElement) {
        const indicator = document.createElement('div');
        indicator.className = 'thinking-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        parentElement.appendChild(indicator);
        return indicator;
    }

    /**
     * Removes the "thinking" indicator.
     * @param {HTMLElement} indicator The indicator element to remove.
     */
    function hideThinkingIndicator(indicator) {
        if (indicator) {
            indicator.remove();
        }
    }
});
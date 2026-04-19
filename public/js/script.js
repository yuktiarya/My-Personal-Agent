document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const typingIndicator = document.getElementById('typing-indicator');
    const clearBtn = document.getElementById('clear-chat');

    // Scroll to bottom of chat
    const scrollToBottom = () => {
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    // Add message to DOM
    const addMessage = (content, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        
        // Simple markdown parsing to HTML if needed (for bold, line breaks)
        // For security, ideally we should sanitize this. 
        // We'll replace newlines with br tags for clean formatting.
        let formattedContent = content.replace(/\n/g, '<br>');
        
        // Handle markdown-style bold
        formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        contentDiv.innerHTML = `<p>${formattedContent}</p>`;
        
        messageDiv.appendChild(contentDiv);
        
        // Insert before typing indicator
        chatBox.insertBefore(messageDiv, typingIndicator);
        scrollToBottom();
    };

    // Show/hide typing indicator
    const showTyping = () => {
        typingIndicator.style.display = 'block';
        scrollToBottom();
    };

    const hideTyping = () => {
        typingIndicator.style.display = 'none';
    };

    // Handle form submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const message = userInput.value.trim();
        if (!message) return;

        // 1. Add user message to UI
        addMessage(message, 'user');
        
        // 2. Clear input
        userInput.value = '';
        
        // 3. Show loading
        showTyping();

        try {
            // 4. Send to backend
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            
            // 5. Hide loading and show response
            hideTyping();
            
            if (response.ok) {
                addMessage(data.reply, 'ai');
            } else {
                addMessage("Oops! Something went wrong. Please try again.", 'ai');
                console.error("Error from API:", data.error);
            }
            
        } catch (error) {
            hideTyping();
            addMessage("Unable to connect to the server. Is it running?", 'ai');
            console.error(error);
        }
    });

    // Handle clear chat
    clearBtn.addEventListener('click', async () => {
        if(confirm("Are you sure you want to clear the chat history?")) {
            // Optional: send a clear request to backend to reset memory
            try {
                await fetch('/clear', { method: 'POST' });
            } catch(e) {
                console.error("Could not clear backend memory", e);
            }
            
            // Clear UI, keeping only typing indicator
            Array.from(chatBox.children).forEach(child => {
                if(child.id !== 'typing-indicator') {
                    child.remove();
                }
            });
            
            // Add initial welcome message back
            addMessage("Hello! I am your AI agent. You can ask me for crypto prices or weather information. How can I help you today?", 'ai');
        }
    });
});

// Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatArea = document.getElementById('chat-area');
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const preview = document.getElementById('preview');
    const removeImage = document.getElementById('remove-image');

    // Auto-resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Handle image upload
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                imagePreview.style.display = 'inline-block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Remove image
    removeImage.addEventListener('click', function() {
        imageUpload.value = '';
        imagePreview.style.display = 'none';
        preview.src = '';
    });

    // Handle form submission
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = userInput.value.trim();
        if (message || imageUpload.files.length > 0) {
            // Add user message to chat
            addMessage(message, true);
            
            // Create FormData object
            const formData = new FormData(chatForm);
            
            // Show loading message
            const loadingMessage = addMessage("Processing your request...", false);
            
            // Send to backend
            fetch('/chatbot/', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                }
            })
            .then(response => response.json())
            .then(data => {
                // Remove loading message
                loadingMessage.remove();
                
                // Clean up the response text to get just the product name
                let productName = data.message;
                if (productName) {
                    // Remove the prefix "The product you are searching for is"
                    productName = productName.replace(/^The product you are searching for is\s+/i, '');
                    // Remove any trailing punctuation
                    productName = productName.replace(/[.,!?]+$/, '');
                    // Trim whitespace
                    productName = productName.trim();
                }
                
                // Add bot response
                if (data.image_url) {
                    // If response includes an image
                    const messageDiv = addMessageWithImage(data.message, data.image_url, false);
                    
                    // Add search button if we have a product name
                    if (productName) {
                        const searchButton = document.createElement('button');
                        searchButton.className = 'search-button';
                        searchButton.innerHTML = '<i class="fas fa-search"></i> Search for this product';
                        searchButton.onclick = function() {
                            window.location.href = `/?q=${encodeURIComponent(productName)}`;
                        };
                        
                        const textDiv = messageDiv.querySelector('.text');
                        textDiv.appendChild(document.createElement('br'));
                        textDiv.appendChild(searchButton);
                    }
                } else {
                    // If response is text only
                    const messageDiv = addMessage(data.message, false);
                    
                    // Add search button if we have a product name
                    if (productName) {
                        const searchButton = document.createElement('button');
                        searchButton.className = 'search-button';
                        searchButton.innerHTML = '<i class="fas fa-search"></i> Search for this product';
                        searchButton.onclick = function() {
                            window.location.href = `/?q=${encodeURIComponent(productName)}`;
                        };
                        
                        const textDiv = messageDiv.querySelector('.text');
                        textDiv.appendChild(document.createElement('br'));
                        textDiv.appendChild(searchButton);
                    }
                }
            })
            .catch(error => {
                // Remove loading message
                loadingMessage.remove();
                // Show error message
                addMessage("Sorry, there was an error processing your request.", false);
                console.error('Error:', error);
            });
            
            // Clear input and reset image preview
            userInput.value = '';
            userInput.style.height = 'auto';
            imageUpload.value = '';
            imagePreview.style.display = 'none';
            preview.src = '';
        }
    });

    // Initialize chat widget as minimized
    const chatWidget = document.getElementById('chatWidget');
    chatWidget.classList.add('minimized');
});

// Add a message to the chat
function addMessage(text, isUser) {
    const chatArea = document.getElementById('chat-area');
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'message-user' : 'message-bot';
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = isUser ? 'U' : 'G';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'text';
    textDiv.textContent = text;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(textDiv);
    chatArea.appendChild(messageDiv);
    
    // Scroll to bottom
    chatArea.scrollTop = chatArea.scrollHeight;
    
    return messageDiv;
}

// Add a message with an image to the chat
function addMessageWithImage(text, imageUrl, isUser) {
    const chatArea = document.getElementById('chat-area');
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'message-user' : 'message-bot';
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = isUser ? 'U' : 'G';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'text';
    
    if (text) {
        const textDiv = document.createElement('p');
        textDiv.textContent = text;
        contentDiv.appendChild(textDiv);
    }
    
    const imageDiv = document.createElement('div');
    imageDiv.className = 'message-image';
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Response image';
    imageDiv.appendChild(img);
    contentDiv.appendChild(imageDiv);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    chatArea.appendChild(messageDiv);
    
    // Scroll to bottom
    chatArea.scrollTop = chatArea.scrollHeight;
    
    return messageDiv;
}

// Toggle chat widget between minimized and expanded states
function toggleChat() {
    const chatWidget = document.getElementById('chatWidget');
    chatWidget.classList.toggle('minimized');
} 
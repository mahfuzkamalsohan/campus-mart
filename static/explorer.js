function toggleCart() {
    const cartMenu = document.getElementById('cartMenu');
    cartMenu.classList.toggle('open');
}


function handleSearch() {
    const searchInput = document.getElementById('searchInput').value;
    if (searchInput.trim() === '') {
      alert('Please enter a search term.');
      return;
    }
    alert('Searching for: ' + searchInput);
    document.getElementById('searchInput').value = '';
}

function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const price = document.getElementById('priceFilter').value;
    const condition = document.getElementById('conditionFilter').value;
    const university = document.getElementById('universityFilter').value;
    const transactionType = document.getElementById('transactionTypeFilter').value;

    // Placeholder for filter logic
    console.log('Applying filters:', {
        category,
        price,
        condition,
        university,
        transactionType
    });

    // Example: Filter listings (this would be replaced with actual filtering logic)
    alert(`Filtering by: Category=${category || 'All'}, Price=${price || 'All'}, Condition=${condition || 'All'}, University=${university || 'All'}, Transaction Type=${transactionType || 'All'}`);
}

function toggleDropdown() {
    const dropdown = document.getElementById('accountDropdown');
    dropdown.classList.toggle('active');
}


function closeDropdown(event) {
    const dropdown = document.getElementById('accountDropdown');
    const accountBtn = document.getElementById('accountBtn');
    if (!accountBtn.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove('active');
    }
}

// Attach event listeners to filter dropdowns
document.getElementById('categoryFilter').addEventListener('change', applyFilters);
document.getElementById('priceFilter').addEventListener('change', applyFilters);
document.getElementById('conditionFilter').addEventListener('change', applyFilters);
document.getElementById('universityFilter').addEventListener('change', applyFilters);
document.getElementById('transactionTypeFilter').addEventListener('change', applyFilters);

// Attach event listeners for the account dropdown
document.getElementById('accountBtn').addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    toggleDropdown();
});
document.addEventListener('click', closeDropdown);

// Chat Box Functionality
function toggleChat() {
    const chatBox = document.getElementById('chatBox');
    if (chatBox) {
        chatBox.classList.toggle('collapsed');
    }
}

function switchReceiver(receiverId) {
    // Remove active class from all recipients
    document.querySelectorAll('.recipient').forEach(recipient => {
        recipient.classList.remove('active');
    });
    
    // Add active class to selected recipient
    const selectedRecipient = document.querySelector(`[data-receiver="${receiverId}"]`);
    if (selectedRecipient) {
        selectedRecipient.classList.add('active');
    }
    
    // Load chat history for the selected recipient
    const chatHistory = document.getElementById('chatHistory');
    if (chatHistory) {
        chatHistory.innerHTML = `
            <div class="message received">
                <p>Hello! How can I help you today?</p>
                <span class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        `;
    }
}

// Initialize chat box when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chatBox');
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.chat-input button');
    
    if (chatBox && chatInput && sendButton) {
        // Handle send button click
        sendButton.addEventListener('click', function() {
            sendMessage();
        });
        
        // Handle enter key press
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    function sendMessage() {
        const chatInput = document.querySelector('.chat-input input');
        const chatHistory = document.getElementById('chatHistory');
        
        if (chatInput && chatHistory) {
            const message = chatInput.value.trim();
            if (message) {
                const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                // Add sent message
                chatHistory.innerHTML += `
                    <div class="message sent">
                        <p>${message}</p>
                        <span class="timestamp">${timestamp}</span>
                    </div>
                `;
                
                // Clear input
                chatInput.value = '';
                
                // Scroll to bottom
                chatHistory.scrollTop = chatHistory.scrollHeight;
                
                // Simulate response
                setTimeout(() => {
                    chatHistory.innerHTML += `
                        <div class="message received">
                            <p>Thanks for your message! I'll get back to you soon.</p>
                            <span class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    `;
                    chatHistory.scrollTop = chatHistory.scrollHeight;
                }, 1000);
            }
        }
    }
    
    // Set initial active recipient
    const firstRecipient = document.querySelector('.recipient');
    if (firstRecipient) {
        firstRecipient.classList.add('active');
    }
});




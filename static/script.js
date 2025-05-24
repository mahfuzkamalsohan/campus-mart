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



function toggleCart() {
  const cartMenu = document.getElementById('cartMenu');
  cartMenu.classList.toggle('open');
}

function moveCarousel(button, direction) {
  const carousel = button.parentElement.querySelector('.carousel-images');
  const images = carousel.querySelectorAll('img');
  const totalImages = images.length;
  let currentIndex = parseInt(carousel.dataset.index || 0);
  currentIndex = (currentIndex + direction + totalImages) % totalImages;
  carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
  carousel.dataset.index = currentIndex;
}

function toggleChat() {
  const chatBox = document.getElementById('chatBox');
      const chatContent = chatBox.querySelector('.chat-content');
      const toggleIcon = chatBox.querySelector('.chat-toggle');
      chatBox.classList.toggle('open');
      if (chatBox.classList.contains('open')) {
        chatContent.style.display = 'flex';
        toggleIcon.style.display = 'none'; // Hide the chat.png image
      } else {
        chatContent.style.display = 'none';
        toggleIcon.style.display = 'block'; // Show the chat.png image
      }
}

function switchReceiver(receiverId) {
  const chatHistory = document.getElementById('chatHistory');
  const recipients = document.querySelectorAll('.recipient');
  
  // Remove active class from all recipients
  recipients.forEach(recipient => recipient.classList.remove('active'));
  
  // Add active class to clicked recipient
  const selectedRecipient = document.querySelector(`[data-receiver="${receiverId}"]`);
  selectedRecipient.classList.add('active');

  // Update chat history based on receiver (simulated)
  let messages = '';
  if (receiverId === 'john') {
    messages = `
      <div class="message received">
        <p>Hey, is the laptop still available?</p>
        <span class="timestamp">10:30 AM</span>
      </div>
      <div class="message sent">
        <p>Yes, it’s still available!</p>
        <span class="timestamp">10:32 AM</span>
      </div>
    `;
  } else if (receiverId === 'jane') {
    messages = `
      <div class="message received">
        <p>Can you deliver the item?</p>
        <span class="timestamp">11:00 AM</span>
      </div>
      <div class="message sent">
        <p>Sure, delivery is possible!</p>
        <span class="timestamp">11:05 AM</span>
      </div>
    `;
  } else if (receiverId === 'alex') {
    messages = `
      <div class="message received">
        <p>What's the condition of the phone?</p>
        <span class="timestamp">9:15 AM</span>
      </div>
      <div class="message sent">
        <p>Like new, barely used.</p>
        <span class="timestamp">9:20 AM</span>
      </div>
    `;
  } else if (receiverId === 'emma') {
    messages = `
      <div class="message received">
        <p>Is the price negotiable?</p>
        <span class="timestamp">12:00 PM</span>
      </div>
      <div class="message sent">
        <p>Let's discuss, what's your offer?</p>
        <span class="timestamp">12:05 PM</span>
      </div>
    `;
  }
  
  chatHistory.innerHTML = messages;
  chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to bottom
}

  // Simulated backend data (replace with actual backend response)
  const listingType = 'auction'; // Possible values: 'fixed', 'auction', or 'negotiable'

  // Get references to the divs
  const fixedDiv = document.getElementById("fixed");
  const auctionDiv = document.getElementById("auction");
  const negotiableDiv = document.getElementById("negotiable");
  
  
  
  
  
  // Show the appropriate div based on listingType
  if (listingType === 'fixed') {
    fixedDiv.style.display = 'block';
    
  } else if (listingType === 'auction') {
    auctionDiv.style.display = 'block';
  } else if (listingType === 'negotiable') {
    negotiableDiv.style.display = 'block';
  }
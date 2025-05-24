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
        // ... existing code ...

function toggleCart() {
    const cartMenu = document.getElementById('cartMenu');
    cartMenu.classList.toggle('open');
}
// Account Dropdown Functionality
document.addEventListener('DOMContentLoaded', function() {
    const accountBtn = document.getElementById('accountBtn');
    const accountDropdown = document.getElementById('accountDropdown');

    // Toggle dropdown on account button click
    accountBtn.addEventListener('click', function(e) {
        e.preventDefault();
        accountDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!accountBtn.contains(e.target) && !accountDropdown.contains(e.target)) {
            accountDropdown.classList.remove('active');
        }
    });

    // Handle logout
    const logoutLink = document.querySelector('a[href="logoutpage"]');
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = 'logoutpage';
        }
    });

    // Handle my listings
    const myListingsLink = document.querySelector('a[href="my_listings"]');
    myListingsLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'my_listings';
    });
});

// Edit Account Functionality
document.addEventListener('DOMContentLoaded', function() {
    const editAccountBtn = document.getElementById('editAccountBtn');
    const editAccountForm = document.getElementById('editAccountForm');
    const publicProfile = document.querySelector('.public-profile');
    const cancelEditBtn = document.getElementById('cancelEdit');
    const accountEditForm = document.getElementById('accountEditForm');

    if (editAccountBtn) {
        editAccountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (publicProfile) {
                publicProfile.style.display = 'none';
            }
            if (editAccountForm) {
                editAccountForm.style.display = 'block';
            }
        });
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (publicProfile) {
                publicProfile.style.display = 'block';
            }
            if (editAccountForm) {
                editAccountForm.style.display = 'none';
            }
        });
    }

    if (accountEditForm) {
        accountEditForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                username: document.getElementById('editUsername')?.value || '',
                name: document.getElementById('editName')?.value || '',
                email: document.getElementById('editEmail')?.value || '',
                university: document.getElementById('editUniversity')?.value || '',
                department: document.getElementById('editDepartment')?.value || '',
                batch: document.getElementById('editBatch')?.value || '',
                roll: document.getElementById('editRoll')?.value || '',
                bio: document.getElementById('editBio')?.value || '',
                dob: document.getElementById('editDob')?.value || '',
                phone: document.getElementById('editPhone')?.value || ''
            };
            
            // Update profile display if elements exist
            const updateElement = (id, value) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value;
                }
            };

            updateElement('username', formData.username);
            updateElement('name', formData.name);
            updateElement('email', formData.email);
            updateElement('university', formData.university);
            updateElement('department', formData.department);
            updateElement('batch', formData.batch);
            updateElement('roll', formData.roll);
            updateElement('bio', formData.bio);
            updateElement('dob', formData.dob);
            updateElement('phone', formData.phone);
            
            // Hide the form and show the profile
            if (publicProfile) {
                publicProfile.style.display = 'block';
            }
            if (editAccountForm) {
                editAccountForm.style.display = 'none';
            }
            
            // Show success message
            alert('Profile updated successfully!');
        });
    }
});

// Admin toggle functionality
let isAdmin = false;

function toggleAdminMode() {
    isAdmin = !isAdmin;
    const adminInfo = document.querySelector('.admin-info');
    const adminFields = document.querySelectorAll('.admin-only');
    const adminToggle = document.querySelector('.admin-toggle');
    
    if (isAdmin) {
        adminInfo.style.display = 'block';
        adminFields.forEach(field => field.style.display = 'block');
        adminToggle.textContent = 'Exit Admin Mode';
        adminToggle.style.backgroundColor = '#ff6b6b';
    } else {
        adminInfo.style.display = 'none';
        adminFields.forEach(field => field.style.display = 'none');
        adminToggle.textContent = 'Admin Mode';
        adminToggle.style.backgroundColor = '#9cbde7';
    }
}
// Add admin toggle button to the page
const adminToggle = document.createElement('button');
adminToggle.className = 'admin-toggle';
adminToggle.textContent = 'Admin Mode';
adminToggle.onclick = toggleAdminMode;
document.querySelector('.public-profile').appendChild(adminToggle);

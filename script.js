// Initialize EmailJS
(function() {
    emailjs.init("-7cijAApCbyojWU34");
})();

// Contact form submission
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Show loading state
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Get form data
    const formData = {
        name: this.querySelector('#name').value,
        email: this.querySelector('#email').value,
        message: this.querySelector('#message').value
    };

    // Send email using EmailJS
    emailjs.send('service_qzq1bpg', 'template_9rfbppj', formData)
        .then(function() {
            // Show success message
            alert('Message sent successfully!');
            // Reset form
            document.getElementById('contact-form').reset();
        }, function(error) {
            // Show error message
            alert('Failed to send message. Please try again.');
            console.error('EmailJS error:', error);
        })
        .finally(function() {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
});

// Enhanced CV Download functionality
function toggleDropdown() {
    const dropdown = document.getElementById('cvDropdown');
    dropdown.classList.toggle('show');

    // Close dropdown when clicking outside
    document.addEventListener('click', function closeDropdown(e) {
        if (!e.target.matches('.download-btn')) {
            dropdown.classList.remove('show');
            document.removeEventListener('click', closeDropdown);
        }
    });
}

// Verify file download functionality with format checking
document.querySelectorAll('.download-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const filePath = this.getAttribute('href');
        const fileFormat = filePath.split('.').pop().toLowerCase();
        
        // Check if file exists
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    e.preventDefault();
                    alert(`Sorry, the ${fileFormat.toUpperCase()} version is currently unavailable. Please try another format.`);
                }
            })
            .catch(error => {
                e.preventDefault();
                alert('Sorry, there was an error downloading the file. Please try again later.');
                console.error('Download error:', error);
            });
    });
}); 
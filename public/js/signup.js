document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        role: 'staff' // Default role for new signups
    };
    
    const errorMessage = document.getElementById('error-message');
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Successful signup
            localStorage.setItem('user', JSON.stringify(data.data));
            window.location.href = '/pos.html'; // Changed from index.html to pos.html
        } else {
            // Failed signup
            errorMessage.textContent = data.message || 'Error creating account';
        }
    } catch (error) {
        console.error('Signup error:', error);
        errorMessage.textContent = 'An error occurred. Please try again.';
    }
});

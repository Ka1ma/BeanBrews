// Check if user is authenticated
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/me', {
            credentials: 'include'
        });

        if (!response.ok) {
            window.location.href = '/login.html';
            return;
        }

        const data = await response.json();
        if (!data.success) {
            window.location.href = '/login.html';
            return;
        }

        // Update UI with user info
        const currentUser = document.getElementById('currentUser');
        if (currentUser) {
            currentUser.textContent = `${data.user.role.charAt(0).toUpperCase() + data.user.role.slice(1)}: ${data.user.username}`;
        }

        return data.user;
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/login.html';
    }
}

// Update current time
function updateTime() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString();
    }
}

// Setup logout functionality
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include'
                });

                if (response.ok) {
                    window.location.href = '/login.html';
                } else {
                    console.error('Logout failed');
                }
            } catch (error) {
                console.error('Logout error:', error);
            }
        });
    }
}

// Initialize authentication check
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    updateTime();
    setInterval(updateTime, 1000);
    setupLogout();
});

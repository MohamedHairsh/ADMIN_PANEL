document.getElementById("sidebarToggle").addEventListener("click", function () {
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.querySelector(".main-content");

    sidebar.classList.toggle("collapsed");
    mainContent.classList.toggle("collapsed");
});

// NOTIFICATION FUNCTION
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }
          // STATUS CHANGE HANDLER
        document.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn');
            if (btn && btn.title === 'Mark Ready') {
                const row = btn.closest('tr');
                const statusBadge = row.querySelector('.status-badge');
                statusBadge.className = 'status-badge status-available';
                statusBadge.textContent = 'Available';
                btn.innerHTML = '<i class="fas fa-tools"></i>';
                btn.title = 'Maintenance';
                btn.className = 'btn btn-outline-warning btn-sm';
                showNotification('Room marked as ready!', 'success');
            }
        });

         // SUBMENU TOGGLE
        document.querySelectorAll('.toggle-submenu').forEach(function (toggle) {
            toggle.addEventListener('click', function (e) {
                e.preventDefault();
                const submenu = this.nextElementSibling;
                submenu.classList.toggle('show');

                // Toggle icon rotation if needed    
                const icon = this.querySelector('.submenu-toggle-icon');
                if (icon) icon.classList.toggle('rotate');
            });
        });
function logout() {   
    window.location.href = "Adminsignin.html";
    }

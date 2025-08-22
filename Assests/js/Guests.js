document.getElementById("sidebarToggle").addEventListener("click", function () {
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.querySelector(".main-content");

    sidebar.classList.toggle("collapsed");
    mainContent.classList.toggle("collapsed");
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

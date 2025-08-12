
let rooms = [];
let editingRoomId = null;
let currentImage = null;
 
document.addEventListener('DOMContentLoaded', function () {
    loadRooms();
    setupSingleImageUpload();
    setupSearchAndFilter();
   
});
 
function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
 
 
function showAddRoomForm() {
    document.getElementById('roomFormSection').style.display = 'block';
    document.getElementById('searchFilterSection').style.display = 'none';
    document.getElementById('roomsTable').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('formTitle').innerHTML = '<i class="fas fa-plus me-2"></i>Add New Room';
    resetForm();
}
 
function hideRoomForm() {
    document.getElementById('roomFormSection').style.display = 'none';
    document.getElementById('searchFilterSection').style.display = 'block';
    document.getElementById('roomsTable').style.display = 'block';
    resetForm();
    renderRooms(rooms);
}
 
function setupSingleImageUpload() {
    const uploadArea = document.getElementById('singleImageUpload');
    const fileInput = document.getElementById('roomImage');
 
    uploadArea.addEventListener('click', (e) => {
        if (e.target.closest('.image-preview')) return;
        fileInput.click();
    });
 
    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) handleSingleImageUpload(file);
    });
 
    uploadArea.addEventListener('dragover', function (e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
 
    uploadArea.addEventListener('dragleave', function (e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });
 
    uploadArea.addEventListener('drop', function (e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) handleSingleImageUpload(file);
    });
}
 
function handleSingleImageUpload(file) {
    const maxFileSize = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
 
    if (!allowedTypes.includes(file.type)) {
        alert(`${file.name}: Invalid file type.`);
        return;
    }
 
    if (file.size > maxFileSize) {
        alert(`${file.name}: File too large.`);
        return;
    }
 
    const reader = new FileReader();
    reader.onload = function (e) {
        currentImage = e.target.result;
        updateSingleImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
}
 
function updateSingleImagePreview(imageSrc) {
    document.getElementById('uploadContent').style.display = 'none';
    document.getElementById('imagePreview').style.display = 'flex';
    document.getElementById('previewImg').src = imageSrc;
}
 
function removeSingleImage() {
    currentImage = null;
    document.getElementById('uploadContent').style.display = 'flex';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('previewImg').src = '';
}
 
function setupSearchAndFilter() {
    document.getElementById('searchGuest').addEventListener('input', filterRooms);
    document.getElementById('filterRoomType').addEventListener('change', filterRooms);
    document.getElementById('filterBedType').addEventListener('change', filterRooms);
    document.getElementById('filterStatus').addEventListener('change', filterRooms);
}
 
function filterRooms() {
    const guestSearch = document.getElementById('searchGuest').value.toLowerCase();
    const roomType = document.getElementById('filterRoomType').value;
    const bedType = document.getElementById('filterBedType').value;
    const status = document.getElementById('filterStatus').value;
 
    const filtered = rooms.filter(room => {
        const matchGuest = !guestSearch || (room.guestname && room.guestname.toLowerCase().includes(guestSearch));
        const matchRoom = !roomType || room.type === roomType;
        const matchBed = !bedType || room.bedtype === bedType;
        const matchStatus = !status || room.status === status;
 
        return matchGuest && matchRoom && matchBed && matchStatus;
    });
 
    renderRooms(filtered);
}
 
function saveRoom() {
    const form = document.getElementById('roomForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
 
  if (!currentImage && !editingRoomId) {
    alert('Please upload a room image.');
    return;
}
 
 
    const saveBtn = document.getElementById('saveRoomBtn');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';
    saveBtn.disabled = true;
 
 
    setTimeout(() => {
        const roomData = {
           
            guestname: document.getElementById('guestname').value,
            email: document.getElementById('email').value,
            mobile: document.getElementById('mobile').value,
            address: document.getElementById('address').value,
            checkin: document.getElementById('Checkin').value,
            checkout: document.getElementById('Checkout').value,
            adults: document.getElementById('Maxadults').value,
            children: document.getElementById('Maxchild').value,
            type: document.getElementById('roomType').value,
            bedtype: document.getElementById('Bedtype').value,
            occupancy: document.getElementById('maxOccupancy').value,
            image: currentImage,
            status: 'booked',
            createdAt: new Date().toISOString()
        };
 
            if (editingRoomId) {
        const index = rooms.findIndex(room => room.id === editingRoomId);
        if (index !== -1) {
            roomData.id = editingRoomId; // Preserve ID
            rooms[index] = { ...rooms[index], ...roomData };
        }
    } else {
        roomData.id = Date.now().toString();
        rooms.push(roomData);
    }
 
 
        localStorage.setItem('hotelRooms', JSON.stringify(rooms));
        hideRoomForm();
        showNotification('Room saved successfully!', 'success');
        renderRooms();
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
    }, 800);
}
 
function renderRooms() {
    const tableBody = document.getElementById('roomsTableBody');
    tableBody.innerHTML = '';
 
    rooms.forEach(room => {
        const row = document.createElement('tr');
 
        row.innerHTML = `
            <td>${room.guestname}</td>
            <td>${room.mobile}</td>
            <td>${room.checkin} to ${room.checkout}</td>
            <td>${room.type}</td>
            <td>${room.status}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editRoom('${room.id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteRoom('${room.id}')">Delete</button>
            </td>
        `;
 
        tableBody.appendChild(row);
    });
 
    document.getElementById('roomList').classList.remove('d-none');
}
 
function editRoom(roomId) {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;
 
    editingRoomId = roomId;
    showAddRoomForm();
 
    document.getElementById('guestname').value = room.guestname || '';
    document.getElementById('email').value = room.email || '';
    document.getElementById('mobile').value = room.mobile || '';
    document.getElementById('address').value = room.address || '';
    document.getElementById('Checkin').value = room.checkin || '';
    document.getElementById('Checkout').value = room.checkout || '';
    document.getElementById('Maxadults').value = room.adults || '';
    document.getElementById('Maxchild').value = room.children || '';
    document.getElementById('roomType').value = room.type || '';
    document.getElementById('Bedtype').value = room.bedtype || '';
    document.getElementById('maxOccupancy').value = room.occupancy || '';
 
    if (room.image) {
        currentImage = room.image;
        updateSingleImagePreview(currentImage);
    }
 
    document.getElementById('formTitle').innerHTML = '<i class="fas fa-edit me-2"></i>Edit Room';
}
 
function deleteRoom(roomId) {
    if (!confirm('Are you sure you want to delete this room?')) return;
    rooms = rooms.filter(room => room.id !== roomId);
    localStorage.setItem('hotelRooms', JSON.stringify(rooms));
    renderRooms(rooms);
    showNotification('Room deleted successfully!', 'success');
}
 
function resetForm() {
    document.getElementById('roomForm').reset();
    removeSingleImage();
    editingRoomId = null;
    currentImage = null;
}
 
function renderRooms(roomsToRender = rooms) {
    const table = document.getElementById('roomsTable');
    const tableBody = document.getElementById('roomsTableBody');
    const emptyState = document.getElementById('emptyState');
 
    if (roomsToRender.length === 0) {
        table.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
 
    emptyState.style.display = 'none';
    table.style.display = 'block';
 
    tableBody.innerHTML = roomsToRender.map(room => {
        const statusClass = `status-${room.status || 'available'}`;
        return `
        <tr>
          <td class="text-center align-middle">${room.guestname}</td>
            <td class="text-center align-middle">${room.mobile}</td>
            <td class="text-center align-middle">${getRoomTypeDisplay(room.type)}</td>
            <td class="text-center align-middle">${room.bedtype}</td>
            <td class="text-center align-middle">${room.checkin}</td>
            <td class="text-center align-middle">${room.checkout}</td>
            <td class="text-center align-middle">
                <span class="status-badge ${statusClass}">${getStatusDisplay(room.status)}</span>
            </td>
            <td class="text-center align-middle">
                <div class="table-actions">
                    <button class="btn btn-edit btn-sm" onclick="editRoom('${room.id}')">
                        <i class="fas fa-edit me-1"></i>Edit
                    </button>
                    <button class="btn btn-delete btn-sm" onclick="deleteRoom('${room.id}')">
                        <i class="fas fa-trash me-1"></i>Delete
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');
}
 
function getRoomTypeDisplay(type) {
    const types = {
        'standard': 'Standard Room',
        'deluxe': 'Deluxe Suite',
        'executive': 'Executive Suite',
        'royal': 'Royal Suite Room'
    };
    return types[type] || type;
}
 
function getStatusDisplay(status) {
    const statuses = {
        'available': 'Available',
        'occupied': 'Occupied',
        'maintenance': 'Maintenance',
        'booked': 'Booked'
    };
    return statuses[status] || status;
}
 
function loadRooms() {
    const savedRooms = localStorage.getItem('hotelRooms');
    if (savedRooms) {
        rooms = JSON.parse(savedRooms);
    }
   
    renderRooms();
}
 
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999;';
    notification.innerHTML = `${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}





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





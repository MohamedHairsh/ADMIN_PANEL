let roomTypes = [];

// Fetch all room types from backend
async function fetchRoomTypes() {
    try {
        const res = await fetch("https://localhost:7235/api/Room/GetAllRoomType");
        const data = await res.json();

        
        roomTypes = data.map(item => ({
            id: item.roomId,     
            name: item.roomType
        }));

        renderRoomTypes();
    } catch (error) {
        console.error("Error fetching room types:", error);
        // Remove alert here to avoid duplicate popups
    
        
    }
}

// Add new room type to backend
async function handleRoomTypeAction() {
    const roomInput = document.getElementById('Room');
    const roomName = roomInput.value.trim();

    if (roomName === '') {
        alert('Please enter a room type');
        return;
    }

    try {
        const res = await fetch("https://localhost:7235/api/Room/AddRoomType", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roomType: roomName })
        });

        if (!res.ok) {
            const errorData = await res.json();
            alert(errorData.message || "Failed to add room type");
            return;
        }

        roomInput.value = '';
        await fetchRoomTypes(); // refresh list
    } catch (error) {
        console.error("Error adding room type:", error);
        alert("Error adding room type");
    }
}

// Edit room type
async function editRoomType(id, oldName) {
    const newName = prompt("Edit Room Type:", oldName);
    if (!newName || newName.trim() === "") return;

    try {
        const res = await fetch(`https://localhost:7235/api/Room/UpdateRoomType/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roomType: newName.trim() })
        });

        if (!res.ok) {
            const errorData = await res.json();
            alert(errorData.message || "Failed to update room type");
            return;
        }

        await fetchRoomTypes();
    } catch (error) {
        console.error("Error updating room type:", error);
        alert("Error updating room type");
    }
}

// Delete room type
async function deleteRoomType(id) {
    if (!confirm("Are you sure you want to delete this room type?")) return;

    try {
        const res = await fetch(`https://localhost:7235/api/Room/DeleteRoomType/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            const errorData = await res.json();
            alert(errorData.message || "Failed to delete room type");
            return;
        }

        await fetchRoomTypes();
    } catch (error) {
        console.error("Error deleting room type:", error);
        alert("Error deleting room type");
    }
}

// Render room types in table
function renderRoomTypes() {
    const tableBody = document.getElementById('roomsTableBody');
    const emptyState = document.getElementById('emptyState');

    if (roomTypes.length === 0) {
        tableBody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    tableBody.innerHTML = roomTypes.map(room => `
        <tr>
            <td>${room.name}</td>
            <td>
                
                 <button class="btn btn-edit btn-sm" onclick="editRoom('${room.id}')"><i class="fas fa-edit me-1"></i></button>
                 <button class="btn btn-edit btn-sm" onclick="editRoom('${room.id}')"><i class="fas fa-trash me-1"></i></button>
               
            </td>
        </tr>
    `).join('');
}

// Initial load
fetchRoomTypes();



// bed type

let bedTypes = [];

// Fetch all bed types from backend
async function fetchBedTypes() {
    try {
        const res = await fetch("https://localhost:7235/api/Room/GetAllBedType");
        const data = await res.json();

        // Keep ID + name for edit/delete
        bedTypes = data.map(item => ({
            id: item.bedId,     // Adjust this if API returns a different property
            name: item.bedType
        }));

        renderBedTypes();
    } catch (error) {
        console.error("Error fetching bed types:", error);
        alert("Failed to load bed types");
    }
}

// Add new bed type
async function handleBedTypeAction() {
    const bedInput = document.getElementById('BedTypeInput');
    const bedName = bedInput.value.trim();

    if (bedName === '') {
        alert('Please enter a bed type');
        return;
    }

    try {
        const res = await fetch("https://localhost:7235/api/Room/AddBedType", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bedType: bedName })
        });

        if (!res.ok) {
            const errorData = await res.json();
            alert(errorData.message || "Failed to add bed type");
            return;
        }

        bedInput.value = '';
        await fetchBedTypes(); // refresh list
    } catch (error) {
        console.error("Error adding bed type:", error);
       
    }
}

// Edit bed type
async function editBedType(id, oldName) {
    const newName = prompt("Edit Bed Type:", oldName);
    if (!newName || newName.trim() === "") return;

    try {
        const res = await fetch(`https://localhost:7235/api/Room/UpdateBedType/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bedType: newName.trim() })
        });

        if (!res.ok) {
            const errorData = await res.json();
            alert(errorData.message || "Failed to update bed type");
            return;
        }

        await fetchBedTypes();
    } catch (error) {
        console.error("Error updating bed type:", error);
        alert("Error updating bed type");
    }
}

// Delete bed type
async function deleteBedType(id) {
    if (!confirm("Are you sure you want to delete this bed type?")) return;

    try {
        const res = await fetch(`https://localhost:7235/api/Room/DeleteBedType/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            const errorData = await res.json();
            alert(errorData.message || "Failed to delete bed type");
            return;
        }

        await fetchBedTypes();
    } catch (error) {
        console.error("Error deleting bed type:", error);
        alert("Error deleting bed type");
    }
}

// Render bed types
function renderBedTypes() {
    const tableBody = document.getElementById('bedTableBody');
    const emptyBedState = document.getElementById('emptyBedState');

    if (bedTypes.length === 0) {
        tableBody.innerHTML = '';
        emptyBedState.style.display = 'block';
        return;
    }

    emptyBedState.style.display = 'none';
    tableBody.innerHTML = bedTypes.map(bed => `
        <tr>
            <td>${bed.name}</td>
            <td>
                
                <button class="btn btn-edit btn-sm" onclick="editBedType('${bed.id}', '${bed.name}')"><i class="fas fa-edit me-1"></i></button>
                 <button class="btn btn-edit btn-sm" onclick="deleteBedType('${bed.id}')"><i class="fas fa-trash me-1"></i></button>
              
            </td>
        </tr>
    `).join('');
}

// Initial load
fetchBedTypes();


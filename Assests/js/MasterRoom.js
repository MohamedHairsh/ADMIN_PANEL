let roomTypes = [];
async function fetchRoomTypes() {
    try {
        const res = await fetch("https://localhost:7235/api/Room/GetAllRoomType");
        const data = await res.json();
 console.log("Room API Data:", data);
        
        roomTypes = data.map(item => ({
           id: item.roomID, 
            name: item.roomType
        }));

        renderRoomTypes();
    } catch (error) {
        console.error("Error fetching room types:", error);
    
    }
}
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
        await fetchRoomTypes(); 
    } catch (error) {
        console.error("Error adding room type:", error);
        alert("Error adding room type");
    }
}

async function editRoom(id, oldName) {
    const newName = prompt("Edit Room:", oldName);
    if (!newName || newName.trim() === "") return;

    try {
        const res = await fetch(`https://localhost:7235/api/Room/UpdateRoom/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: newName.trim()  
            })
        });

        if (!res.ok) {
            const errorData = await res.text();
            alert(errorData || "Failed to update room");
            return;
        }

        showToast("RoomType updated successfully","success");
        await fetchRoomTypes();   
    } catch (error) {
        console.error("Error updating room:", error);
        alert("Error updating room");
    }
}



async function deleteRoomType(id) {
    if (!confirm("Are you sure you want to delete this room type?")) return;

    try {
        const res = await fetch(`https://localhost:7235/api/Room/DeleteRoomType/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            const errorData = await res.json();
            showToast(errorData.message || "Failed to delete room type","danger");
            return;
        }

        await fetchRoomTypes();
    } catch (error) {
        console.error("Error deleting room type:", error);
        showToast("Error deleting room type","warning");
    }
}

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
                <button class="btn btn-edit btn-sm" 
        onclick="editMaster('Room', '${room.id}', '${room.name}')">
    <i class="fas fa-edit me-1"></i>
</button>
                <button class="btn btn-sm " 
                        onclick="deleteMaster('Room', '${room.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}


fetchRoomTypes();


let bedTypes = [];


async function fetchBedTypes() {
    try {
        const res = await fetch("https://localhost:7235/api/Room/GetAllBedType");
        const data = await res.json();

        console.log("Bed API Data:", data);
        bedTypes = data.map(item => ({
            id: item.bedID,     
            name: item.bedType
        }));

        renderBedTypes();
    } catch (error) {
        console.error("Error fetching bed types:", error);
        alert("Failed to load bed types");
    }
}


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
            body: JSON.stringify({ 
                bedType: bedName })
        });

        if (!res.ok) {
            const errorData = await res.json();
            alert(errorData.message || "Failed to add bed type");
            return;
        }

        bedInput.value = '';
        await fetchBedTypes(); 
    } catch (error) {
        console.error("Error adding bed type:", error);
       
    }
}

async function editBed(id, oldName) {
    const newName = prompt("Edit Bed:", oldName);
    if (!newName || newName.trim() === "") return;

    try {
        const res = await fetch(`https://localhost:7235/api/Room/UpdateBed/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: newName.trim()   
            })
        });

        if (!res.ok) {
            const errorData = await res.text();
            alert(errorData || "Failed to update bed");
            return;
        }

        alert("Bed updated successfully");
        await fetchBedTypes();   
    } catch (error) {
        console.error("Error updating bed:", error);
        alert("Error updating bed");
    }
}





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
                <button class="btn btn-edit btn-sm" 
        onclick="editMaster('Bed', '${bed.id}', '${bed.name}')">
    <i class="fas fa-edit me-1"></i>
</button>
                <button class="btn btn-sm " 
                        onclick="deleteMaster('Bed', '${bed.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}


fetchBedTypes();

async function deleteMaster(type, id) {
    console.log("🔍 Delete Called - Type:", type, "ID:", id);

    if (!id) {
        alert("Invalid ID, cannot delete.");
        return;
    }

    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
        const res = await fetch(`https://localhost:7235/api/Room/MasterRoomDelete/${type}/${id}`, {
            method: "DELETE"
        });

        if (res.status === 204) {
            showToast(`${type} deleted successfully`,"success");
            if (type === "Room") {
                await fetchRoomTypes();
            } else if (type === "Bed") {
                await fetchBedTypes();
            }
        } else {
            const error = await res.text();
            console.error("Delete failed:", error);
            showToast("Delete failed: " + error,"danger");
        }
    } catch (err) {
        console.error("Error deleting:", err);
        alert("Error deleting " + type,"warning");
    }
}
async function editMaster(type, id, oldName) {
    const newName = prompt(`Edit ${type}:`, oldName);
    if (!newName || newName.trim() === "") return;

    try {
        const res = await fetch(`https://localhost:7235/api/Room/MasterRoomUpdate/${type}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: newName.trim()   
            })
        });

        if (!res.ok) {
            const errorData = await res.text();
            showToast(errorData || `Failed to update ${type}`,"danger");
            return;
        }

        showToast(`${type} updated successfully`,"success");

       
        if (type === "Room") {
            await fetchRoomTypes();
        } else if (type === "Bed") {
            await fetchBedTypes();
        }
    } catch (error) {
        console.error(`Error updating ${type}:`, error);
        showToast(`Error updating ${type}`,"warning");
    }
}
// Toast function
function showToast(message, type = "primary") {
    const toastEl = document.getElementById("toastMessage");
    const toastBody = document.getElementById("toastBody");

    toastEl.className = `toast align-items-center text-bg-${type} border-0`;
    toastBody.textContent = message;

   // Create toast with options (3 sec auto-hide)
    const toast = new bootstrap.Toast(toastEl, {
        delay: 3000,   // 3 seconds
        autohide: true
    });
    toast.show();
}

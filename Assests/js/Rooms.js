
function showAddRoomForm() {
    document.getElementById("roomFormSection").style.display = "block";
    document.getElementById("searchFilterSection").style.display = "none";
    document.getElementById("roomsTable").style.display = "none";
    document.getElementById("emptyState").style.display = "none";
}


function hideRoomForm() {
    document.getElementById("roomFormSection").style.display = "none";
    document.getElementById("searchFilterSection").style.display = "block";
    document.getElementById("roomsTable").style.display = "block";
}


async function saveRoom() {
    const hotelId = "00000000-0000-0000-0000-000000000000";
    const roomType = document.getElementById("roomType")?.value || "";
    const roomName = document.getElementById("roomName")?.value || "";
    const bedType = document.getElementById("bedType")?.value || "";
    const maxAdults = parseInt(document.getElementById("maxOccupancy")?.value || 0);
    const roomSize = document.getElementById("floorNumber")?.value || "";
    const basePrice = parseFloat(document.querySelector("input[placeholder='$ 15.63/Night']")?.value || 0);
    const roomStatus = document.getElementById("roomStatus")?.value || "";
    const breakfastIncluded = document.getElementById("breakfast")?.checked || false;
    const availableRooms = 1;

    let roomImageBase64 = "";
    const fileInput = document.getElementById("roomImage");
    if (fileInput && fileInput.files.length > 0) {
        roomImageBase64 = await toBase64(fileInput.files[0]);
    }
    const roomImagesJson = JSON.stringify([roomImageBase64]);

    const roomDto = {
        HotelId: hotelId,
        RoomType: roomType,
        RoomName: roomName,
        BedType: bedType,
        MaxAdults: maxAdults,
        MaxChildren: 0,
        RoomSize: roomSize,
        BasePrice: basePrice,
        RoomStatus: roomStatus,
        RefundPolicy: "",
        BreakfastIncluded: breakfastIncluded,
        AvailableRooms: availableRooms,
        RoomImagesJson: roomImagesJson
    };

    try {
        const response = await fetch("https://localhost:7235/api/Room/CreateRoom", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(roomDto)
        });

        if (response.ok) {
            showToast("Room created successfully", "success");
            hideRoomForm();
            loadRooms();
        } else {
            showToast("Failed to create room", "danger");
        }
    } catch (error) {
        console.error(error);
        showToast("Server error", "warning");
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



function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}







async function populateRoomTypeDropdown() {
    const dropdown = document.getElementById('roomType');
    dropdown.innerHTML = '<option value="">Loading...</option>';

    try {
        const res = await fetch("https://localhost:7235/api/Room/GetAllRoomType");
        const data = await res.json();

        dropdown.innerHTML = '<option value="">Select Room Type</option>';
        data.forEach(item => {
            const option = document.createElement('option');
             option.value = item.roomType || item.name; 
            option.textContent = item.roomType || item.name; 
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading room types:", error);
        dropdown.innerHTML = '<option value="">Error loading</option>';
    }
}

async function populateBedTypeDropdown() {
    const dropdown = document.getElementById('bedType');
    dropdown.innerHTML = '<option value="">Loading...</option>';

    try {
        const res = await fetch("https://localhost:7235/api/Room/GetAllBedType");
        const data = await res.json();

        dropdown.innerHTML = '<option value="">Select Bed Type</option>';
        data.forEach(item => {
            const option = document.createElement('option');
             option.value = item.bedType || item.name; 
            option.textContent = item.bedType || item.name;
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading bed types:", error);
        dropdown.innerHTML = '<option value="">Error loading</option>';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    populateRoomTypeDropdown();
    populateBedTypeDropdown();
    loadRooms();
});





const roomsApiUrl = "https://localhost:7235/api/Room/GetAllRooms"; 


function loadRooms() {
    fetch("https://localhost:7235/api/Room/GetAllRooms")
        .then(res => res.json())
        .then(data => {
            const tableBody = document.getElementById("roomsTableBody");
            tableBody.innerHTML = "";

            if (!data || data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="7" class="text-center">No rooms found</td></tr>`;
                return;
            }

           let rowsHtml = "";
data.forEach(room => {
    rowsHtml += `
        <tr>
            <td class="text-center">${room.roomType || ""}</td>
            <td class="text-center">${room.bedType || ""}</td>
            <td class="text-center">${room.basePrice || ""}</td>
            <td class="text-center">${room.roomStatus || ""}</td>
            <td class="text-center">${room.roomSize || ""}</td>
            <td class="text-center">
                <button class="btn btn-sm" onclick="editRoom('${room.roomId}')">
                    <i class="fas fa-edit me-1"></i>
                </button>
                <button class="btn btn-sm" onclick="deleteRoom('${room.roomId}')">
                    <i class="fas fa-trash-alt me-1"></i>
                </button>
            </td>
        </tr>
    `;
});
tableBody.innerHTML = rowsHtml;

        })
        .catch(err => console.error(err));
}


// document.addEventListener("DOMContentLoaded", loadRooms);



async function deleteRoom(roomId) {
    if (!confirm("Are you sure you want to delete this room?")) return;

    try {
        const res = await fetch(`https://localhost:7235/api/Room/DeleteRoom?id=${roomId}`, {
            method: "DELETE"
        });

        if (res.ok) {
            showToast("Room deleted successfully", "success");
            loadRooms();
        } 
        else if (res.status === 404) {
            showToast(" Room not found — it may have already been deleted.","danger");
        } 
        else {
            const errText = await res.text();
            showToast(`Failed to delete room: ${errText}`,"danger");
        }
    } 
    catch (error) {
        console.error("Delete error:", error);
        showToast(" Server error while deleting room","warning");
    }
}

async function editRoom(roomId) {
    try {
        const res = await fetch(`https://localhost:7235/api/Room/GetRoomById?id=${roomId}`);
       
        const rooms = await res.json();
        if (!rooms || rooms.length === 0) {
            showToast("Room not found","danger");
            return;
        }

        const room = rooms[0]; 

       
        showAddRoomForm();

        
        document.getElementById("roomType").value = room.roomType || "";
        
        document.getElementById("bedType").value = room.bedType || "";
        document.getElementById("maxOccupancy").value = room.maxAdults || "";
        document.getElementById("floorNumber").value = room.roomSize || "";
        document.querySelector("input[placeholder='$ 15.63/Night']").value = room.basePrice || "";
        document.getElementById("roomStatus").value = room.roomStatus || "";
        document.getElementById("breakfast").checked = room.breakfastIncluded || false;

        
        let hiddenInput = document.getElementById("roomId");
        if (!hiddenInput) {
            hiddenInput = document.createElement("input");
            hiddenInput.type = "hidden";
            hiddenInput.id = "roomId";
            document.getElementById("roomForm").appendChild(hiddenInput);
        }
        hiddenInput.value = room.roomId;

        const saveBtn = document.getElementById("saveRoomBtn");
        saveBtn.innerHTML = `<i class="fas fa-save me-2"></i>Update Room`;
        saveBtn.setAttribute("onclick", "updateRoom()");
    } catch (error) {
        console.error("Edit error:", error);
        showToast("Server error while loading room details","warning");
    }
}


async function updateRoom() {
   
    const roomId = document.getElementById("roomId").value;
    const hotelId = "00000000-0000-0000-0000-000000000000";

    const roomType = document.getElementById("roomType")?.value || "";
    const roomName = document.getElementById("roomName")?.value || "";
    const bedType = document.getElementById("bedType")?.value || "";
    const maxAdults = parseInt(document.getElementById("maxOccupancy")?.value || 0);
    const roomSize = document.getElementById("floorNumber")?.value || "";
    const basePrice = parseFloat(document.querySelector("input[placeholder='$ 15.63/Night']")?.value || 0);
    const roomStatus = document.getElementById("roomStatus")?.value || "";
    const breakfastIncluded = document.getElementById("breakfast")?.checked || false;
    const availableRooms = 1;

    let roomImageBase64 = "";
    const fileInput = document.getElementById("roomImage");
    if (fileInput && fileInput.files.length > 0) {
        roomImageBase64 = await toBase64(fileInput.files[0]);
    }
    const roomImagesJson = JSON.stringify([roomImageBase64]);

   
    const roomDto = {
        RoomId: roomId,
        HotelId: hotelId,
        RoomType: roomType,
        RoomName: roomName,
        BedType: bedType,
        MaxAdults: maxAdults,
        MaxChildren: 0,
        RoomSize: roomSize,
        BasePrice: basePrice,
        RoomStatus: roomStatus,
        RefundPolicy: "",
        BreakfastIncluded: breakfastIncluded,
        AvailableRooms: availableRooms,
        RoomImagesJson: roomImagesJson
    };

    try {
        const res = await fetch(`https://localhost:7235/api/Room/UpdateRoom/${roomId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(roomDto)
        });

        if (!res.ok) {
            const errText = await res.text();
            showToast(`Failed to update room: ${errText}`,"danger");
            return;
        }

        showToast("Room updated successfully", "success");
        hideRoomForm();
        loadRooms();
    } catch (error) {
        console.error("Update error:", error);
        showToast("Server error while updating room","warning");
    }
}



function addNewRoom() {
    showAddRoomForm();


    document.getElementById("roomForm").reset();


    const hiddenInput = document.getElementById("roomId");
    if (hiddenInput) {
        hiddenInput.remove();
    }


    const saveBtn = document.getElementById("saveRoomBtn");
    saveBtn.innerHTML = `<i class="fas fa-save me-2"></i>Save Room`;
    saveBtn.setAttribute("onclick", "saveRoom()");
}

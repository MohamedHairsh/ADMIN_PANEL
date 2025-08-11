let roomTypes = [];

// Fetch all room types from backend
async function fetchRoomTypes() {
    try {
        const res = await fetch("https://localhost:7235/api/Room/GetAllRoomType");
        const data = await res.json();

        // store only roomType (ignore roomID)
        roomTypes = data.map(item => item.roomType);
        renderRoomTypes();

    } catch (error) {
        console.error("Error fetching room types:", error);
        alert("Failed to load room types");
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
        await fetchRoomTypes(); // refresh list after adding

    } catch (error) {
        console.error("Error adding room type:", error);
        alert("Error adding room type");
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
            <td>${room}</td>
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

        // Only keep bedType (ignore IDs)
        bedTypes = data.map(item => item.bedType);
        renderBedTypes();

   
    } catch (error) {
        console.error("Error fetching room types:", error);
        alert("Failed to load room types");
    }
}

// Add new bed type to backend
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
        alert("Error adding bed type");
    }
}

function renderBedTypes() {
    const tableBody = document.getElementById('bedTableBody');
    const emptyBedState = document.getElementById('emptyBedState');

    if (!bedTypes || bedTypes.length === 0) {
        tableBody.innerHTML = '';
        emptyBedState.style.display = 'block';
        return;
    }

    emptyBedState.style.display = 'none';
    tableBody.innerHTML = bedTypes.map(bed => `
        <tr>
            <td>${bed}</td>
            <td></td>
        </tr>
    `).join('');
}

// Initial load
fetchBedTypes();

// Show Add Room Form (fixing your null innerHTML issue)
function showAddRoomForm() {
    document.getElementById("roomFormSection").style.display = "block";
    document.getElementById("searchFilterSection").style.display = "none";
    document.getElementById("roomsTable").style.display = "none";
    document.getElementById("emptyState").style.display = "none";
}

// Hide Add Room Form
function hideRoomForm() {
    document.getElementById("roomFormSection").style.display = "none";
    document.getElementById("searchFilterSection").style.display = "block";
    document.getElementById("roomsTable").style.display = "block";
}

// Save Room
async function saveRoom() {
    // Collect form values
    const hotelId = "00000000-0000-0000-0000-000000000000"; // replace with real HotelId
    const roomType = document.getElementById("roomType").value;
    const roomName = document.getElementById("roomDescription").value; // You can create a separate input if needed
    const bedType = document.getElementById("roomDescription").value;
    const maxAdults = parseInt(document.getElementById("maxOccupancy").value || 0);
    const maxChildren = 0; // No field provided in HTML, set default
    const roomSize = document.getElementById("floorNumber").value || "";
    const basePrice = parseFloat(document.querySelector("input[placeholder='$ 15.63/Night']").value || 0);
    const roomStatus = document.getElementById("roomStatus").value;
    const refundPolicy = ""; // No field in HTML, set empty string

    // Breakfast Included checkbox
    const breakfastIncluded = document.getElementById("breakfast").checked;

    // AvailableRooms (you may want a separate input in HTML)
    const availableRooms = 1;

    // Handle image upload (convert to Base64 JSON string)
    const fileInput = document.getElementById("roomImage");
    let roomImageBase64 = "";
    if (fileInput.files.length > 0) {
        roomImageBase64 = await toBase64(fileInput.files[0]);
    }

    const roomImagesJson = JSON.stringify([roomImageBase64]); // array as JSON string

    // Build DTO exactly as backend expects
    const roomDto = {
        HotelId: hotelId,
        RoomType: roomType,
        RoomName: roomName,
        BedType: bedType,
        MaxAdults: maxAdults,
        MaxChildren: maxChildren,
        RoomSize: roomSize,
        BasePrice: basePrice,
        RoomStatus: roomStatus,
        RefundPolicy: refundPolicy,
        BreakfastIncluded: breakfastIncluded,
        AvailableRooms: availableRooms,
        RoomImagesJson: roomImagesJson
    };

    console.log("Sending DTO:", roomDto);

    // Send POST request
    try {
        const response = await fetch("https://localhost:7235/api/Room/CreateRoom", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(roomDto)
        });

        if (response.ok) {
            const result = await response.json();
            alert("✅ " + result.message);
            document.getElementById("roomForm").reset();
            hideRoomForm();
        } else {
            const errorText = await response.text();
            alert("❌ Error: " + errorText);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Failed to connect to server");
    }
}

// Convert File to Base64
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
            option.value = item.roomId || item.id;  
            option.textContent = item.roomType || item.name; 
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading room types:", error);
        dropdown.innerHTML = '<option value="">Error loading</option>';
    }
}

async function populateBedTypeDropdown() {
    const dropdown = document.getElementById('roomDescription');
    dropdown.innerHTML = '<option value="">Loading...</option>';

    try {
        const res = await fetch("https://localhost:7235/api/Room/GetAllBedType");
        const data = await res.json();

        dropdown.innerHTML = '<option value="">Select Bed Type</option>';
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.bedId || item.id;    
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
});







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
 
  let amenities = [];
let editingAmenityId = null;
let currentImageBase64 = "";
 
document.addEventListener('DOMContentLoaded', () => {
  loadAmenities();
});
 
// ✅ Show form for adding new amenity
function showAmenityForm() {
  document.getElementById('AmenitiesFormSection').style.display = 'block';
  document.getElementById('amenitiesCardsContainer').style.display = 'none';
  document.getElementById('emptyState').style.display = 'none';
 
  // Reset form and button for adding new amenity
  resetAmenityForm();
 
  // Ensure button is set to "Add Amenity"
  const submitButton = document.querySelector('.btn-primary');
  submitButton.innerHTML = '<i class="fas fa-save me-2"></i>Add Amenity';
  submitButton.setAttribute('onclick', 'saveAmenity()');
}
 
// ✅ Hide form
function hideAmenityForm() {
  document.getElementById("AmenitiesFormSection").style.display = "none";
 
  // Reset button back to "Add Amenity" when hiding form
  const submitButton = document.querySelector('.btn-primary');
  if (submitButton) {
    submitButton.innerHTML = '<i class="fas fa-save me-2"></i>Add Amenity';
    submitButton.setAttribute('onclick', 'saveAmenity()');
  }
 
  editingAmenityId = null;
 
  // Show amenities list or empty state
  if (amenities.length === 0) {
    document.getElementById("emptyState").style.display = "block";
    document.getElementById("amenitiesCardsContainer").style.display = "none";
  } else {
    document.getElementById("emptyState").style.display = "none";
    document.getElementById("amenitiesCardsContainer").style.display = "flex";
  }
}
 
// ✅ Reset form
function resetAmenityForm() {
  document.getElementById('amenitiesForm').reset();
  document.getElementById('imagePreview').style.display = 'none';
  currentImageBase64 = "";
  editingAmenityId = null;
}
 
function previewAmenityImage() {
  const file = document.getElementById('image').files[0];
  const preview = document.getElementById('imagePreview');
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
}
 
// ✅ CREATE - Add new amenity
async function saveAmenity() {
  const formData = new FormData();
 
  formData.append("AmenitiesName", document.getElementById("name").value);
  formData.append("Description", document.getElementById("Description").value);
  formData.append("OpeningTime", document.getElementById("opening").value);
  formData.append("ClosingTime", document.getElementById("closing").value);
  formData.append("Status", document.getElementById("status").value);
 
  const fileInput = document.getElementById("image");
  if (fileInput.files.length > 0) {
    formData.append("AmenityImageFile", fileInput.files[0]);
  }
 
  try {
    const response = await fetch("https://localhost:7235/api/Amenities/CreateAmenities", {
      method: "POST",
      body: formData
    });
 
    if (response.ok) {
      alert("Amenity saved successfully ✅");
      hideAmenityForm();
      loadAmenities();
    } else {
      const err = await response.text();
      alert("Failed to save ❌: " + err);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong ❌");
  }
}
 
//
// ✅ READ - Get All Amenities
//
async function loadAmenities() {
  try {
    const res = await fetch("https://localhost:7235/api/Amenities/GetAllBooking");
    amenities = await res.json();
    renderAmenities();
  }
  catch (error) {
    console.error(error);
    showNotification("Failed to load amenities", "danger");
  }
}
 
//
// ✅ UPDATE - Fill form for editing
//
function UpdateAmenities(id) {
  // Compare as strings
  const amenity = amenities.find(a => a.amenitiesId.toString() === id.toString());
  if (!amenity) return alert("Amenity not found!");
 
  // Set editing ID
  editingAmenityId = id;
 
  // Fill form
  document.getElementById("name").value = amenity.amenitiesName || "";
  document.getElementById("Description").value = amenity.description || "";
 
  // Format time values properly
  const openingTime = amenity.openingTime ? new Date(amenity.openingTime) : null;
  const closingTime = amenity.closingTime ? new Date(amenity.closingTime) : null;
 
  document.getElementById("opening").value = openingTime ?
    `${String(openingTime.getHours()).padStart(2, '0')}:${String(openingTime.getMinutes()).padStart(2, '0')}` : "";
 
  document.getElementById("closing").value = closingTime ?
    `${String(closingTime.getHours()).padStart(2, '0')}:${String(closingTime.getMinutes()).padStart(2, '0')}` : "";
 
  document.getElementById("status").value = amenity.status || "";
 
  // Show existing image
  if (amenity.amenityImage) {
    const preview = document.getElementById("imagePreview");
    preview.src = `https://localhost:7235${amenity.amenityImage}`;
    preview.style.display = "block";
  }
 
  // Change button text to "Update Amenity"
  const submitButton = document.querySelector('.btn-primary');
  submitButton.innerHTML = '<i class="fas fa-save me-2"></i>Update Amenity';
  submitButton.setAttribute('onclick', 'updateAmenity()');
 
  // Show form
  document.getElementById('AmenitiesFormSection').style.display = 'block';
  document.getElementById('amenitiesCardsContainer').style.display = 'none';
  document.getElementById('emptyState').style.display = 'none';
}
 
//
// ✅ UPDATE - Send update request
//
async function updateAmenity() {
  if (!editingAmenityId) {
    alert("No amenity selected for editing");
    return;
  }
 
  const formData = new FormData();
  formData.append("AmenitiesName", document.getElementById("name").value);
  formData.append("Description", document.getElementById("Description").value);
  formData.append("OpeningTime", document.getElementById("opening").value);
  formData.append("ClosingTime", document.getElementById("closing").value);
  formData.append("Status", document.getElementById("status").value);
 
  const fileInput = document.getElementById("image");
  if (fileInput.files.length > 0) {
    formData.append("AmenityImageFile", fileInput.files[0]);
  }
 
  try {
    const response = await fetch(`https://localhost:7235/api/Amenities/UpdateAmenities/${editingAmenityId}`, {
      method: "PUT",
      body: formData
    });
 
    if (response.ok) {
      alert("Amenity updated successfully ✅");
      hideAmenityForm();
      loadAmenities();
    } else {
      const err = await response.text();
      alert("Failed to update ❌: " + err);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong ❌");
  }
}
 
//
// ✅ DELETE Amenity
//
async function deleteAmenity(id) {
  if (!confirm("Are you sure you want to delete this amenity?")) return;
 
  try {
    const response = await fetch(`https://localhost:7235/api/Amenities/DeleteAmenities?id=${id}`, {
      method: "DELETE"
    });
   
    if (response.ok) {
      showNotification("Amenity deleted successfully!", "success");
      loadAmenities();
    } else {
      const err = await response.text();
      alert("Failed to delete ❌: " + err);
    }
  } catch (error) {
    console.error(error);
    showNotification("Error deleting amenity", "danger");
  }
}
 
function formatTime(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}
 
//
// ✅ RENDER Amenities Cards
//
function renderAmenities() {
  const container = document.getElementById('amenitiesCardsContainer');
  const emptyState = document.getElementById('emptyState');
  container.innerHTML = '';
 
  if (!amenities || amenities.length === 0) {
    emptyState.style.display = 'block';
    container.style.display = 'none';
    return;
  } else {
    emptyState.style.display = 'none';
    container.style.display = 'flex';
  }
 
  amenities.forEach(amenity => {
    // Determine badge color based on status
    const statusClass = amenity.status === 'Active' ? 'bg-success' :
                        amenity.status === 'Maintenance' ? 'bg-warning' : 'bg-danger';
 
    // Build full image URL
    const imageUrl = `https://localhost:7235${amenity.amenityImage}`;
 
    container.innerHTML += `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="d-flex align-items-center">
                <img src="${imageUrl}" alt="${amenity.amenitiesName}"
                     style="width:40px;height:40px;object-fit:cover;border-radius:8px;margin-right:8px;">
                <h5 class="card-title mb-0">${amenity.amenitiesName}</h5>
              </div>
              <span class="badge ${statusClass}">${capitalize(amenity.status)}</span>
            </div>
            <p class="card-text text-muted">${amenity.description || ''}</p>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">
                Hours: ${formatTime(amenity.openingTime)} - ${formatTime(amenity.closingTime)}
              </small>
              <div class="d-flex gap-2">
                <button onclick="UpdateAmenities('${amenity.amenitiesId}')" class="btn btn-sm text-primary p-0">Edit</button>
                <button onclick="deleteAmenity('${amenity.amenitiesId}')" class="btn btn-sm text-danger p-0">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  });
}
 
function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}
 
// ✅ Toast Notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999;';
  notification.innerHTML = `${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}
async function handleSignIn(event) {
    event.preventDefault();
    
    const userId = document.getElementById('signinUserId').value;
    const password = document.getElementById('signinPassword').value;

    const requestData = {
        email: userId,
        password: password
    };

    try {
        const response = await fetch('https://localhost:7235/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const result = await response.json();

        if (response.ok) {
            // ✅ Save token and user info in localStorage
            localStorage.setItem('token', result.token);
            localStorage.setItem('userId', result.userId);
            localStorage.setItem('email', result.email);

            // ✅ Redirect to admin dashboard
            window.location.href = "HotelAdmin.html";
        } else {
            alert(result.error || 'Login failed');
        }
    } catch (error) {
        alert('Server error: ' + error.message);
    }
     
}

 
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.form-slide').forEach(form => form.classList.add('hidden'));

    if (tab === 'signin') {
        document.querySelector('.tab-btn:nth-child(1)').classList.add('active');
        document.getElementById('signinForm').classList.remove('hidden');
    } else {
        document.querySelector('.tab-btn:nth-child(2)').classList.add('active');
        document.getElementById('signupForm').classList.remove('hidden');
    }
}


// ✅ Handle Sign Up
async function handleSignUp(event) {
    event.preventDefault();

    const fullName = document.getElementById("signupFullName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const agreeTerms = document.getElementById("agreeTerms").checked;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    if (!agreeTerms) {
        alert("You must agree to the terms & conditions.");
        return;
    }

    // Use full name split for firstName and lastName
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    const payload = {
        firstName,
        lastName,
        email,
        password,
        role: "HotelAdmin" // or set as per your use case
    };

    try {
        const response = await fetch("https://localhost:7235/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.errors || "Registration failed.");
            return;
        }

        alert("Account created successfully! Please sign in.");
        switchTab('signin');

    } catch (errors) {
        console.error("Sign up error:", error);
        alert("Something went wrong.");
    }
}
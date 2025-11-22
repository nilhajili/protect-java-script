const registerNameInput = document.getElementById("registerNameInput");
const registerLastnameInput = document.getElementById("registerLastnameInput");
const registerEmailInput = document.getElementById("registerEmailInput");
const registerPasswordInput = document.getElementById("registerPasswordInput");
const registerBtn = document.getElementById("registerBtn");
const registerUser = async () => {
    const firstname = registerNameInput?.value.trim();
    const lastname = registerLastnameInput?.value.trim();
    const email = registerEmailInput?.value.trim();
    const password = registerPasswordInput?.value.trim();

    if (!firstname || !lastname || !email || !password) {
        alert("Please fill all fields");
        return;
    }
    try {
        const res = await fetch("https://ilkinibadov.com/api/v1/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstname, lastname, email, password })
        });
        const data = await res.json();
        if (res.ok) {
            alert("Registration successful! Please login");
            window.location.href = "./login.html";
        } else {
            alert(data.error || "Registration failed");
        }
    } catch (error) {
        console.error(error);
    }
}
registerBtn?.addEventListener("click", registerUser);
const loginEmailInput = document.getElementById("loginEmailInput");
const loginPasswordInput = document.getElementById("loginPasswordInput");
const loginBtn = document.getElementById("loginBtn");

const loginUser = async () => {
    const email = loginEmailInput?.value.trim();
    const password = loginPasswordInput?.value.trim();

    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }
    try {
        const res = await fetch("https://ilkinibadov.com/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("authToken", data.token); 
            alert("Login successful");
            window.location.href = "./productDetail.html";
        } else {
            alert(data.error || "Login failed");
        }
    } catch (error) {
        console.error(error);
    }
}
loginBtn?.addEventListener("click", loginUser);

const registerNameInput = document.getElementById("registerNameInput")
const registerLastnameInput = document.getElementById("registerLastnameInput")
const registerEmailInput = document.getElementById("registerEmailInput")
const registerPasswordInput = document.getElementById("registerPasswordInput")

const registerBtn = document.getElementById("registerBtn")

const registerUser = async () => {
    try {
        const res = await fetch("https://ilkinibadov.com/api/v1/auth/signup", {
            method: "POST",
            body: JSON.stringify({
                firstname: registerNameInput.value,
                lastname: registerLastnameInput.value,
                email: registerEmailInput.value,
                password: registerPasswordInput.value
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await res.json()

        console.log(data)
    } catch (error) {
        console.error(error)
    }
}

registerBtn?.addEventListener("click", registerUser)
const loginEmailInput = document.getElementById("loginEmailInput")
const loginPasswordInput = document.getElementById("loginPasswordInput")

const loginBtn = document.getElementById("loginBtn")

const loginUser = async () => {
    try {
        const res = await fetch("https://ilkinibadov.com/api/v1/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email: loginEmailInput.value,
                password: loginPasswordInput.value
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await res.json()

        if (res.ok) {
            window.location.href = "http://127.0.0.1:3000/proyekt/index.html?serverWindowId=62dbdfd2-95b4-4506-9a5d-a61c63aa8472";
        } else {
            alert(data.error)
        }


    } catch (error) {
        console.error(error)
    }
}

loginBtn.addEventListener("click", loginUser)
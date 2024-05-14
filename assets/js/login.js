function validateForm() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var errorMessage = document.getElementById("error-message");

    if (username === "" || password === "") {
        errorMessage.innerText = "Please enter both username and password.";
        return false;
    } else {
        // Here you can add your login authentication logic
        // For this example, I'm simply showing an error message
        errorMessage.innerText = "Invalid username or password.";
        return false;
    }
}

function signInWithGoogle() {
    // Placeholder for Google sign-in functionality
    alert("Signing in with Google...");
}

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const formMessage = document.getElementById('formMessage');

    if (name === '' || email === '' || message === '') {
        formMessage.textContent = 'Please fill in all fields.';
        return;
    }

    if (!validateEmail(email)) {
        formMessage.textContent = 'Please enter a valid email address.';
        return;
    }

    formMessage.textContent = 'Thank you for contacting us, ' + name + '! We will get back to you soon.';
    formMessage.style.color = 'green';
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

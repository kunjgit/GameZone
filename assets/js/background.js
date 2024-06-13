const randomColor = () => {
    const hex = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += hex[Math.floor(Math.random() * 16)];
    }
    return color;
};

let id;

const startChanging = () => {
    if (!id) { // better practice 
        id = setInterval(change, 2500); // Set interval to 2000 milliseconds (2 seconds)
    }
    function change() {
        document.body.style.backgroundColor = randomColor();
    }
};

const stopChanging = () => {
    clearInterval(id);
    id = null; // flushes out the value after stop and hence no overriding
};

// Start changing colors when the page loads
window.onload = startChanging;

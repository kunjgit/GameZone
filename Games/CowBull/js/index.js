document.addEventListener('DOMContentLoaded', function() {
    // Function to show instructions box
    function showInstructions() {
        const overlay = document.querySelector('.overlay');
        overlay.style.display = 'flex';
    }

    // Function to close instructions box
    function closeInstructions() {
        const overlay = document.querySelector('.overlay');
        overlay.style.display = 'none';
    }

    // Event listener for "How to play?" link
    const howToPlayLink = document.querySelector('.how-to-play');
    howToPlayLink.addEventListener('click', function(event) {
        event.preventDefault();
        showInstructions();
    });

    // Event listener for close button
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', closeInstructions);

    // Event listener for pressing the "Esc" key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeInstructions();
        }
    });
});
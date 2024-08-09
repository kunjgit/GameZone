document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const dropzones = document.querySelectorAll('.dropzone');
    const cardsContainer = document.querySelector('.cards-container');
    const scoreElement = document.getElementById('score');
    const continueBtn = document.getElementById('continue-btn');
    let score = 0;

    function initGame() {
        cards.forEach(card => {
            card.addEventListener('dragstart', dragStart);
            card.addEventListener('dragend', dragEnd);
            cardsContainer.appendChild(card);
        });

        dropzones.forEach(dropzone => {
            dropzone.addEventListener('dragover', dragOver);
            dropzone.addEventListener('dragenter', dragEnter);
            dropzone.addEventListener('dragleave', dragLeave);
            dropzone.addEventListener('drop', drop);
        });

        score = 0;
        updateScore();
        continueBtn.style.display = 'none';
    }

    function dragStart() {
        this.classList.add('dragging');
    }

    function dragEnd() {
        this.classList.remove('dragging');
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
        this.classList.add('highlight');
    }

    function dragLeave() {
        this.classList.remove('highlight');
    }

    function drop() {
        this.classList.remove('highlight');
        const card = document.querySelector('.dragging');
        const cardType = card.getAttribute('data-type');
        const dropzoneType = this.id;

        if (cardType === dropzoneType) {
            this.appendChild(card);
            card.style.transform = 'none';
            card.style.position = 'static';
            card.style.margin = '0';
            score += 5;
            updateScore();
            checkGameEnd();
        } else {
            returnCardToOriginalPosition(card);
        }
    }

    function returnCardToOriginalPosition(card) {
        const originalPosition = card.getBoundingClientRect();
        const cardClone = card.cloneNode(true);
        
        cardClone.style.position = 'fixed';
        cardClone.style.top = `${originalPosition.top}px`;
        cardClone.style.left = `${originalPosition.left}px`;
        cardClone.style.margin = '0';
        cardClone.style.zIndex = '1000';
        cardClone.style.transition = 'all 0.5s ease';
        
        document.body.appendChild(cardClone);
        
        cardsContainer.appendChild(card);
        card.style.opacity = '0';
        
        setTimeout(() => {
            const newPosition = card.getBoundingClientRect();
            cardClone.style.top = `${newPosition.top}px`;
            cardClone.style.left = `${newPosition.left}px`;
        }, 0);
        
        setTimeout(() => {
            card.style.opacity = '1';
            document.body.removeChild(cardClone);
        }, 500);
    }

    function updateScore() {
        scoreElement.textContent = score;
    }

    function checkGameEnd() {
        if (cardsContainer.children.length === 0) {
            continueBtn.style.display = 'block';
        }
    }

    continueBtn.addEventListener('click', initGame);

    initGame();
});
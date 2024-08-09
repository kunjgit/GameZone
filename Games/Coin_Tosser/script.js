// function tossCoin() {
//     const coin = document.getElementById('coin');
//     const resultElement = document.getElementById('result');
    
//     // Remove the flip class to restart the animation
//     coin.classList.remove('flip');

//     // Randomly select heads or tails
//     const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    
//     // Delay to allow the animation to reset
//     setTimeout(() => {
//         coin.classList.add('flip');
//         resultElement.innerText = '';
//     }, 100);
    
//     // Set the result after the animation completes
//     setTimeout(() => {
//         resultElement.innerText = result;
//     }, 1100);
// }

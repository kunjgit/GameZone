// Function to modify coins
function modifyCoins() {
    let coins = prompt("Enter your current amount of coins:");
    coins = parseInt(coins);
    if (isNaN(coins)) {
      alert("Invalid number. Please try again.");
      return;
    }
    let newCoins = 999999;
    alert(`Coins modified successfully to ${newCoins}!`);
  }
  
  // Function to unlock all levels
  function unlockAllLevels() {
    alert("All levels unlocked!");
  }
  
  // Function to unlock all birds
  function unlockAllBirds() {
    alert("All birds unlocked!");
  }
  
  // Function to handle button clicks
  function handleButtonClick(event) {
    const buttonId = event.target.id;
    switch (buttonId) {
      case "modify-coins":
        modifyCoins();
        break;
      case "unlock-levels":
        unlockAllLevels();
        break;
      case "unlock-birds":
        unlockAllBirds();
        break;
      case "exit":
        alert("Exiting script...");
        break;
      default:
        break;
    }
  }
  
  // Add event listeners to buttons
  document.getElementById("modify-coins").addEventListener("click", handleButtonClick);
  document.getElementById("unlock-levels").addEventListener("click", handleButtonClick);
  document.getElementById("unlock-birds").addEventListener("click", handleButtonClick);
  document.getElementById("exit").addEventListener("click", handleButtonClick);
  
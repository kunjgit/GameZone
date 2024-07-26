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
  
  // Function to modify keys
  function modifyKeys() {
    let keys = prompt("Enter your current amount of keys:");
    keys = parseInt(keys);
    if (isNaN(keys)) {
      alert("Invalid number. Please try again.");
      return;
    }
    let newKeys = 9999;
    alert(`Keys modified successfully to ${newKeys}!`);
  }
  
  // Function to unlock all characters
  function unlockAllCharacters() {
    alert("All characters unlocked!");
  }
  
  // Function to handle button clicks
  function handleButtonClick(event) {
    const buttonId = event.target.id;
    switch (buttonId) {
      case "modify-coins":
        modifyCoins();
        break;
      case "modify-keys":
        modifyKeys();
        break;
      case "unlock-characters":
        unlockAllCharacters();
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
  document.getElementById("modify-keys").addEventListener("click", handleButtonClick);
  document.getElementById("unlock-characters").addEventListener("click", handleButtonClick);
  document.getElementById("exit").addEventListener("click", handleButtonClick);
  
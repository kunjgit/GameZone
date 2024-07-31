// Function to modify diamonds
function modifyDiamonds() {
    let diamonds = prompt("Enter your current amount of diamonds:");
    diamonds = parseInt(diamonds);
    if (isNaN(diamonds)) {
      alert("Invalid number. Please try again.");
      return;
    }
    let newDiamonds = 999999;
    alert(`Diamonds modified successfully to ${newDiamonds}!`);
  }
  
  // Function to modify health
  function modifyHealth() {
    let health = prompt("Enter your current health points:");
    health = parseInt(health);
    if (isNaN(health)) {
      alert("Invalid number. Please try again.");
      return;
    }
    let newHealth = 100;
    alert(`Health modified successfully to ${newHealth} points!`);
  }
  
  // Function to unlock all items
  function unlockAllItems() {
    alert("All items unlocked!");
  }
  
  // Function to handle button clicks
  function handleButtonClick(event) {
    const buttonId = event.target.id;
    switch (buttonId) {
      case "modify-diamonds":
        modifyDiamonds();
        break;
      case "modify-health":
        modifyHealth();
        break;
      case "unlock-items":
        unlockAllItems();
        break;
      case "exit":
        alert("Exiting script...");
        break;
      default:
        break;
    }
  }
  
  // Add event listeners to buttons
  document.getElementById("modify-diamonds").addEventListener("click", handleButtonClick);
  document.getElementById("modify-health").addEventListener("click", handleButtonClick);
  document.getElementById("unlock-items").addEventListener("click", handleButtonClick);
  document.getElementById("exit").addEventListener("click", handleButtonClick);
  
// Function to modify gems
function modifyGems() {
    let gems = prompt("Enter your current amount of gems:");
    gems = parseInt(gems);
    if (isNaN(gems)) {
      alert("Invalid number. Please try again.");
      return;
    }
    let newGems = 999999;
    alert(`Gems modified successfully to ${newGems}!`);
  }
  
  // Function to modify gold
  function modifyGold() {
    let gold = prompt("Enter your current amount of gold:");
    gold = parseInt(gold);
    if (isNaN(gold)) {
      alert("Invalid number. Please try again.");
      return;
    }
    let newGold = 999999;
    alert(`Gold modified successfully to ${newGold}!`);
  }
  
  // Function to modify elixir
  function modifyElixir() {
    let elixir = prompt("Enter your current amount of elixir:");
    elixir = parseInt(elixir);
    if (isNaN(elixir)) {
      alert("Invalid number. Please try again.");
      return;
    }
    let newElixir = 999999;
    alert(`Elixir modified successfully to ${newElixir}!`);
  }
  
  // Function to handle button clicks
  function handleButtonClick(event) {
    const buttonId = event.target.id;
    switch (buttonId) {
      case "modify-gems":
        modifyGems();
        break;
      case "modify-gold":
        modifyGold();
        break;
      case "modify-elixir":
        modifyElixir();
        break;
      case "exit":
        alert("Exiting script...");
        break;
      default:
        break;
    }
  }
  
  // Add event listeners to buttons
  document.getElementById("modify-gems").addEventListener("click", handleButtonClick);
  document.getElementById("modify-gold").addEventListener("click", handleButtonClick);
  document.getElementById("modify-elixir").addEventListener("click", handleButtonClick);
  document.getElementById("exit").addEventListener("click", handleButtonClick);
  
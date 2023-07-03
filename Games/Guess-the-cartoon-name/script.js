// Array of image names and corresponding answers
const images = [
    { name: "https://qph.cf2.quoracdn.net/main-qimg-1e393f372465529ab53d763dc3ceb214-pjlq", answer: "Shinchan" },
    { name: "https://c4.wallpaperflare.com/wallpaper/447/181/100/cartoons-wallpaper-preview.jpg", answer: "Ben-10" },
    { name: "https://www.finder.com.au/niche-builder/5f878e02db876.jpg", answer: "Dora the explorer" },
    {name:"https://www.japancitytour.com/wp/wp-content/uploads/2021/03/doraemon.jpg", answer:"Doraemon"},
    {name:"https://images.theconversation.com/files/210123/original/file-20180313-30983-1bk88tb.jpg?ixlib=rb-1.1.0&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip", answer:"Tom and jerry"},
    {name:"https://i.guim.co.uk/img/media/66e444bff77d9c566e53c8da88591e4297df0896/120_0_1800_1080/master/1800.png?width=465&quality=85&dpr=1&s=none", answer:"Pokemon"},
    {name:"https://www.animationxpress.com/wp-content/uploads/2021/09/AAAABe9UGuK5ypr_l6MWT2QflANEaMtgvNk_-2yl7LyoquFHhVvZTV7prNGZkYP4uKRCM8sn3CQcr_7lwflbZnp8yqSaToI8.jpg", answer:"Oggy and the coackreches"},
    {name:"https://ichef.bbci.co.uk/images/ic/1200x675/p08rkqxl.jpg",answer:"Bob the builder"},
    {name:"https://imagesvc.meredithcorp.io/v3/mm/image?q=60&c=sc&poi=face&w=510&h=255&url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F6%2F2012%2F10%2Fsofia-the-first-mother.jpg", answer:"Sofia the first"},
    {name:"https://cdn.britannica.com/08/190808-050-CB26C47B/The-Powerpuff-Girls-Bubbles-Blossom-Buttercup.jpg", answer:"The Powerpuff Girls"},
    {name:"https://w7.pngwing.com/pngs/473/387/png-transparent-a-world-of-winnie-the-pooh-winnie-the-pooh-piglet-eeyore-winnie-the-pooh-and-friends-winnie-the-pooh-characters-computer-wallpaper-cartoons-cartoon-thumbnail.png", answer:"Winnie The Pooh"},
    {name:"https://images-na.ssl-images-amazon.com/images/S/pv-target-images/3f3dba4f477f5d295cb55f1915c9623830875dcd8fe8a493a488912a0954b0e0._RI_TTW_SX720_FMjpg_.png", answer:"Mr Bean"},
    {name:"https://is1-ssl.mzstatic.com/image/thumb/Features113/v4/50/ad/5e/50ad5efd-12dd-117d-141f-519fb50cd238/mzl.ydwoaeoz.png/1200x675mf.jpg", anser:"Mickey Mouse"}
  ];
  
  let currentImageIndex = 1;
  let score = 0;
  const scoreList = [];
  
  // Function to update the score display
  function updateScore() {
    document.getElementById("scoreValue").textContent = score;
  }
  
  // Function to display the next image
  function showNextImage() {
    if (currentImageIndex < images.length) {
      const image = document.getElementById("image");
      image.src = images[currentImageIndex].name;
      image.alt = "Guess the Name";
      document.getElementById("guessInput").value = "";
      document.getElementById("message").textContent = "";
    } else {
      endGame();
    }
  }
  
  // Function to check the guess and provide feedback
  function checkGuess() {
    const guessInput = document.getElementById("guessInput");
    const guess = guessInput.value.toLowerCase();
    const answer = images[currentImageIndex].answer.toLowerCase();
  
    if (guess === answer) {
      score++;
      updateScore();
      document.getElementById("message").textContent = "Correct!";
    } else {
      document.getElementById("message").textContent = "Wrong! Try again.";
    }
  
    currentImageIndex++;
    showNextImage();
  }
  
  // Function to change the picture manually
  function changePicture() {
    if (currentImageIndex < images.length) {
      currentImageIndex++;
      showNextImage();
    } else {
      endGame();
    }
  }
  
  // Function to start the game over
  function startOver() {
    currentImageIndex = 0;
    score = 0;
    scoreList.length = 0;
    updateScore();
    document.getElementById("message").textContent = "";
    document.getElementById("scoreItems").innerHTML = "";
    showNextImage();
  }
  
  // Function to end the game
  function endGame() {
    const guessInput = document.getElementById("guessInput");
    const submitBtn = document.getElementById("submitBtn");
    const changePictureBtn = document.getElementById("changePictureBtn");
  
    guessInput.disabled = true;
    submitBtn.disabled = true;
    changePictureBtn.disabled = true;
    document.getElementById("message").textContent = "Game Over!";
    displayScoreList();
  }
  
  // Function to display the score list
  function displayScoreList() {
    const scoreItems = document.getElementById("scoreItems");
    scoreItems.innerHTML = "";
  
    scoreList.forEach((score, index) => {
      const scoreItem = document.createElement("li");
      scoreItem.textContent = `Game ${index + 1}: ${score}`;
      scoreItems.appendChild(scoreItem);
    });
  }
  
  // Event listener for the submit button
  document.getElementById("submitBtn").addEventListener("click", checkGuess);
  
  // Event listener for the change picture button
  document.getElementById("changePictureBtn").addEventListener("click", changePicture);
  
  // Event listener for the start over button
  document.getElementById("startOverBtn").addEventListener("click", startOver);
  
  // Start the game
  showNextImage();
  
let calcScrollValue = () => {
    let scrollProg = document.getElementById("progress");
    let pos = document.documentElement.scrollTop;
    let calcHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    let scrollValue = Math.round((pos * 100) / calcHeight);
    if (pos > 100) {
      scrollProg.style.display = "grid";
    } else {
      scrollProg.style.display = "none";
    }
    scrollProg.addEventListener("click", () => {
      document.documentElement.scrollTop = 0;
    });
    scrollProg.style.background = `conic-gradient(#6862e8 ${scrollValue}%, #d499de ${scrollValue}%)`;
  };
  
  window.addEventListener('scroll', function() {
    var scrollToTopButton = document.getElementById('progress');
    if (window.pageYOffset > 200) {
      scrollToTopButton.style.display = 'block';
    } else {
      scrollToTopButton.style.display = 'none';
    }
  });


  window.onscroll = calcScrollValue;
  window.onload = calcScrollValue;


  const filled = document.querySelector(".filled");

  function updateProgressBar() {
    filled.style.width = `${ ((window.scrollY) / (document.body.scrollHeight - window.innerHeight ) *100)}%`;
    requestAnimationFrame(updateProgressBar);
  }

  updateProgressBar();
  
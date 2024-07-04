if('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('/bridge/sw.js', {scope: './'})
             .then(response => response)
             .catch(reason => reason);
  }
 
  let deferredPrompt;
  const addBtn = document.createElement('button');
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    addBtn.style.display = 'block';
    addBtn.addEventListener('click', (e) => {
      addBtn.style.display = 'none';
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
          deferredPrompt = null;
        });
    });
  });

class ModalManager {
  openModal() {
    let modal = document.getElementById('lose-modal');
    modal.classList.remove('is-hidden');
    let background = document.getElementById('canvas-wrapper');
    background.classList.add('lost');
  }

  closeModal() {
    let modal = document.getElementById('lose-modal');
    modal.classList.add('is-hidden');
    let background = document.getElementById('canvas-wrapper');
    background.classList.remove('lost');
  }
}


module.exports = ModalManager;

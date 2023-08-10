const helper = {
  stopInputs() {
    // TODO i really should iterate this object instead of writing down each line.
    document.removeEventListener('keydown', handleAttackInputKeyDown);
    inputStatusObj[17][0] = false;
    document.removeEventListener('keydown', handleMoveInputKeyDown);
    inputStatusObj[37][0] = false;
    // inputStatusObj[38][0] = false;
    inputStatusObj[39][0] = false;
  },
  resumeInput() {
    document.addEventListener('keydown', handleAttackInputKeyDown);
    document.addEventListener('keydown', handleMoveInputKeyDown);
  },
  stopJumpInputListening() {
    document.removeEventListener('keydown', handleJumpInputKeyDown);
  },
  resumeJumpInputListening() {
    document.addEventListener('keydown', handleJumpInputKeyDown);
  },
  generateRandomNumberInArr(min, max) {
    return Math.random() * (max - min) + min
  }
};

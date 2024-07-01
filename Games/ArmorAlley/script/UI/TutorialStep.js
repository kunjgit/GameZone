const TutorialStep = (options = {}) => {

  let data, exports;

  data = {
    activated: false,
    completed: false
  };

  function animate() {

    if (!data.activated) {

      if (options.activate) {
        options.activate();
      }

      data.activated = true;

    } else if (!data.completed) {

      if (options.animate()) {
        if (options.complete) {
          options.complete();
        }
        data.completed = true;
      }

    }

  }

  exports = {
    animate,
    highlightControls: options.highlightControls
  };

  return exports;

};

export { TutorialStep };
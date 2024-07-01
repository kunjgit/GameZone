(function(myLunarControl, myDelayer) {

  var root = document.getElementById("console-root");
  var lastFormElm;

  var scrollToBottom = function() {
    window.scrollTo(0, document.body.scrollHeight);
  };

  var log = function(message) {
    clearForm();
    var input = createInputElm(message);
    input.disabled = true;
    root.appendChild(input);
    scrollToBottom();
  };

  var prompt = function(message, callback) {
    clearForm();
    var inputElm = createInputElm(message);
    var form = document.createElement("form");
    form.appendChild(inputElm);
    root.appendChild(form);
    inputElm.focus();
    form.onsubmit = function(event) {
      event.preventDefault();
      callback(inputElm.value.substr(message.length));
      return false; // necessary?
    };
    lastFormElm = form;
    scrollToBottom();
  };

  var createInputElm = function(message) {
    var input = document.createElement("input");
    input.className = "console-line";
    if (message) {
      input.value = message;
    }
    return input;
  };

  var clearForm = function() {
    if (lastFormElm) {
      lastFormElm.onsubmit = null;
      lastFormElm.firstElementChild.disabled = true;
      lastFormElm = null;
    }
  };

  var Logger = {
    log: myDelayer.delay(log),
    prompt: myDelayer.delay(prompt)
  };

  var runLL = function() {
    myLunarControl.run(Logger);
  };

  runLL();

})(lunarcontrol, delayer);
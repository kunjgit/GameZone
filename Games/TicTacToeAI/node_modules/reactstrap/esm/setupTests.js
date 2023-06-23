/* global jest */
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({
  adapter: new Adapter()
});
global.requestAnimationFrame = function (cb) {
  cb(0);
};
global.window.cancelAnimationFrame = function () {};
global.createSpyObj = function (baseName, methodNames) {
  var obj = {};
  for (var i = 0; i < methodNames.length; i += 1) {
    obj[methodNames[i]] = jest.fn();
  }
  return obj;
};
global.document.createRange = function () {
  return {
    setStart: function setStart() {},
    setEnd: function setEnd() {},
    commonAncestorContainer: {}
  };
};
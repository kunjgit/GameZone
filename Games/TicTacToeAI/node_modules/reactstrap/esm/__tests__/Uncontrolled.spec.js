import React from 'react';
import { shallow, mount } from 'enzyme';
import { Alert, ButtonDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, UncontrolledAlert, UncontrolledButtonDropdown, UncontrolledDropdown, UncontrolledTooltip } from '..';
import { keyCodes } from '../utils';
describe('UncontrolledAlert', function () {
  it('should be an Alert', function () {
    var alert = shallow( /*#__PURE__*/React.createElement(UncontrolledAlert, null, "Yo!"));
    expect(alert.type()).toBe(Alert);
  });
  it('should have isOpen default to true', function () {
    var alert = shallow( /*#__PURE__*/React.createElement(UncontrolledAlert, null, "Yo!"));
    expect(alert.prop('isOpen')).toBe(true);
  });
  it('should have toggle function', function () {
    var alert = shallow( /*#__PURE__*/React.createElement(UncontrolledAlert, null, "Yo!"));
    expect(alert.prop('toggle')).toEqual(expect.any(Function));
  });
  it('should toggle isOpen when toggle is called', function () {
    var alert = shallow( /*#__PURE__*/React.createElement(UncontrolledAlert, null, "Yo!"));
    var instance = alert.instance();
    instance.toggle();
    alert.update();
    expect(alert.prop('isOpen')).toBe(false);
  });
});
describe('UncontrolledButtonDropdown', function () {
  it('should be an ButtonDropdown', function () {
    var buttonDropdown = shallow( /*#__PURE__*/React.createElement(UncontrolledButtonDropdown, null, "Yo!"));
    expect(buttonDropdown.type()).toBe(ButtonDropdown);
  });
  it('should have isOpen default to false', function () {
    var buttonDropdown = shallow( /*#__PURE__*/React.createElement(UncontrolledButtonDropdown, null, "Yo!"));
    expect(buttonDropdown.prop('isOpen')).toBe(false);
  });
  it('should have toggle function', function () {
    var buttonDropdown = shallow( /*#__PURE__*/React.createElement(UncontrolledButtonDropdown, null, "Yo!"));
    expect(buttonDropdown.prop('toggle')).toEqual(expect.any(Function));
  });
  it('should toggle isOpen when toggle is called', function () {
    var buttonDropdown = shallow( /*#__PURE__*/React.createElement(UncontrolledButtonDropdown, null, "Yo!"));
    var instance = buttonDropdown.instance();
    instance.toggle();
    buttonDropdown.update();
    expect(buttonDropdown.prop('isOpen')).toBe(true);
  });
});
describe('UncontrolledDropdown', function () {
  it('should be an Dropdown', function () {
    var dropdown = shallow( /*#__PURE__*/React.createElement(UncontrolledDropdown, null, "Yo!"));
    expect(dropdown.type()).toBe(Dropdown);
  });
  it('should have isOpen default to false', function () {
    var dropdown = shallow( /*#__PURE__*/React.createElement(UncontrolledDropdown, null, "Yo!"));
    expect(dropdown.prop('isOpen')).toBe(false);
  });
  it('should have toggle function', function () {
    var dropdown = shallow( /*#__PURE__*/React.createElement(UncontrolledDropdown, null, "Yo!"));
    expect(dropdown.prop('toggle')).toEqual(expect.any(Function));
  });
  it('should toggle isOpen when toggle is called', function () {
    var dropdown = shallow( /*#__PURE__*/React.createElement(UncontrolledDropdown, null, "Yo!"));
    var instance = dropdown.instance();
    instance.toggle();
    dropdown.update();
    expect(dropdown.prop('isOpen')).toBe(true);
  });
  describe('onToggle', function () {
    var handleToggle = jest.fn();
    var element;
    beforeEach(function () {
      element = document.createElement('div');
      document.body.appendChild(element);
    });
    afterEach(function () {
      handleToggle.mockClear();
    });
    it('onToggle should be called on document click', function () {
      mount( /*#__PURE__*/React.createElement(UncontrolledDropdown, {
        onToggle: handleToggle,
        defaultOpen: true
      }, /*#__PURE__*/React.createElement(DropdownToggle, {
        id: "toggle"
      }, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, {
        right: true
      }, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }))));
      expect(handleToggle.mock.calls.length).toBe(0);
      document.body.click();
      expect(handleToggle.mock.calls.length).toBe(1);
      expect(handleToggle.mock.calls[0].length).toBe(2);
      expect(handleToggle.mock.calls[0][1]).toBe(false);
    });
    it('onToggle should be called on container click', function () {
      var wrapper = mount( /*#__PURE__*/React.createElement(UncontrolledDropdown, {
        id: "test",
        onToggle: handleToggle,
        defaultOpen: true
      }, /*#__PURE__*/React.createElement(DropdownToggle, {
        id: "toggle"
      }, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, {
        right: true
      }, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }))), {
        attachTo: element
      });
      expect(handleToggle.mock.calls.length).toBe(0);
      document.getElementById('test').click();
      expect(handleToggle.mock.calls.length).toBe(1);
      expect(handleToggle.mock.calls[0].length).toBe(2);
      expect(handleToggle.mock.calls[0][1]).toBe(false);
      wrapper.detach();
    });
    it('onToggle should be called on toggler click when closed', function () {
      var wrapper = mount( /*#__PURE__*/React.createElement(UncontrolledDropdown, {
        id: "test",
        onToggle: handleToggle,
        defaultOpen: false
      }, /*#__PURE__*/React.createElement(DropdownToggle, {
        id: "toggle"
      }, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, {
        right: true
      }, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }))), {
        attachTo: element
      });
      expect(handleToggle.mock.calls.length).toBe(0);
      document.getElementById('toggle').click();
      expect(handleToggle.mock.calls.length).toBe(1);
      expect(handleToggle.mock.calls[0].length).toBe(2);
      expect(handleToggle.mock.calls[0][1]).toBe(true);
      wrapper.detach();
    });
    it('onToggle should be called on toggler click when opened', function () {
      var wrapper = mount( /*#__PURE__*/React.createElement(UncontrolledDropdown, {
        id: "test",
        onToggle: handleToggle,
        defaultOpen: true
      }, /*#__PURE__*/React.createElement(DropdownToggle, {
        id: "toggle"
      }, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, {
        right: true
      }, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }))), {
        attachTo: element
      });
      expect(handleToggle.mock.calls.length).toBe(0);
      document.getElementById('toggle').click();
      expect(handleToggle.mock.calls.length).toBe(1);
      expect(handleToggle.mock.calls[0].length).toBe(2);
      expect(handleToggle.mock.calls[0][1]).toBe(false);
      wrapper.detach();
    });
    it('onToggle should be called on key closing', function () {
      var wrapper = mount( /*#__PURE__*/React.createElement(UncontrolledDropdown, {
        id: "test",
        onToggle: handleToggle,
        defaultOpen: true
      }, /*#__PURE__*/React.createElement(DropdownToggle, {
        id: "toggle"
      }, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, {
        right: true
      }, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }))), {
        attachTo: element
      });
      expect(handleToggle.mock.calls.length).toBe(0);
      wrapper.find(Dropdown).instance().handleDocumentClick({
        type: 'keyup',
        which: keyCodes.tab
      });
      expect(handleToggle.mock.calls.length).toBe(1);
      expect(handleToggle.mock.calls[0].length).toBe(2);
      expect(handleToggle.mock.calls[0][1]).toBe(false);
      wrapper.detach();
    });
    it('onToggle should be called on key opening', function () {
      var wrapper = mount( /*#__PURE__*/React.createElement(UncontrolledDropdown, {
        id: "test",
        onToggle: handleToggle,
        defaultOpen: false
      }, /*#__PURE__*/React.createElement(DropdownToggle, {
        id: "toggle"
      }, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, {
        right: true
      }, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }))), {
        attachTo: element
      });
      expect(handleToggle.mock.calls.length).toBe(0);
      wrapper.find(Dropdown).instance().handleDocumentClick('keydown', {
        which: keyCodes.down
      });
      expect(handleToggle.mock.calls.length).toBe(1);
      expect(handleToggle.mock.calls[0].length).toBe(2);
      expect(handleToggle.mock.calls[0][1]).toBe(true);
      wrapper.detach();
    });
  });
});
describe('UncontrolledTooltip', function () {
  it('should be an Tooltip', function () {
    var tooltip = shallow( /*#__PURE__*/React.createElement(UncontrolledTooltip, {
      target: "blah"
    }, "Yo!"));
    expect(tooltip.type()).toBe(Tooltip);
  });
  it('should have isOpen default to false', function () {
    var tooltip = shallow( /*#__PURE__*/React.createElement(UncontrolledTooltip, {
      target: "blah"
    }, "Yo!"));
    expect(tooltip.prop('isOpen')).toBe(false);
  });
  it('should have toggle function', function () {
    var tooltip = shallow( /*#__PURE__*/React.createElement(UncontrolledTooltip, {
      target: "blah"
    }, "Yo!"));
    expect(tooltip.prop('toggle')).toEqual(expect.any(Function));
  });
  it('should toggle isOpen when toggle is called', function () {
    var tooltip = shallow( /*#__PURE__*/React.createElement(UncontrolledTooltip, {
      target: "blah"
    }, "Yo!"));
    var instance = tooltip.instance();
    instance.toggle();
    tooltip.update();
    expect(tooltip.prop('isOpen')).toBe(true);
  });
  it('should have boundary set to string', function () {
    var tooltip = shallow( /*#__PURE__*/React.createElement(UncontrolledTooltip, {
      boundariesElement: "window",
      target: "blah"
    }, "Yo!"));
    expect(tooltip.prop('boundariesElement')).toBe('window');
  });
  it('should render correctly with a ref object as the target', function () {
    var target = /*#__PURE__*/React.createRef();
    var tooltip = shallow( /*#__PURE__*/React.createElement(UncontrolledTooltip, {
      target: target
    }, "Yo!"));
    expect(tooltip.exists()).toBe(true);
  });
});
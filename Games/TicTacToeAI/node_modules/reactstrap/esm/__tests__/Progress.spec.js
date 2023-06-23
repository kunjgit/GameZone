import React from 'react';
import { shallow, mount } from 'enzyme';
import { Progress } from '..';
import '@testing-library/jest-dom';
describe('Progress', function () {
  it('should render with "div" tag by default', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Progress, null));
    expect(wrapper.type()).toBe('div');
  });
  it('should render with "progress" class', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Progress, null));
    expect(wrapper.hasClass('progress')).toBe(true);
  });
  it('should render with "value" 0 by default', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(Progress, null));
    expect(wrapper.find('.progress-bar').prop('aria-valuenow')).toBe(0);
  });
  it('should render with "max" 100 by default', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(Progress, null));
    expect(wrapper.find('.progress-bar').prop('aria-valuemax')).toBe(100);
  });
  it('should render with "style" on the parent element', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(Progress, {
      style: {
        height: '20px'
      }
    }));
    expect(getComputedStyle(wrapper.getDOMNode()).getPropertyValue('height')).toBe('20px');
  });
  it('should render with "style" on the progress bar element if bar=true', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(Progress, {
      bar: true,
      style: {
        height: '20px'
      }
    }));
    expect(getComputedStyle(wrapper.find('.progress-bar').getDOMNode()).getPropertyValue('height')).toBe('20px');
  });
  it('should render "barStyle" on the progress bar element', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(Progress, {
      style: {
        height: '20px'
      },
      barStyle: {
        height: '10px'
      }
    }));
    expect(getComputedStyle(wrapper.find('.progress-bar').getDOMNode()).getPropertyValue('height')).toBe('10px');
  });
  it('should render with the given "value" when passed as string prop', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(Progress, {
      value: "10"
    }));
    expect(wrapper.prop('value')).toBe('10');
  });
  it('should render with the given "value" when passed as number prop', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(Progress, {
      value: 10
    }));
    expect(wrapper.prop('value')).toBe(10);
  });
  it('should render with the given "max" when passed as string prop', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(Progress, {
      max: "10"
    }));
    expect(wrapper.prop('max')).toBe('10');
  });
  it('should render with the given "max" when passed as number prop', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(Progress, {
      max: 10
    }));
    expect(wrapper.prop('max')).toBe(10);
  });
  it('should render with "progress-bar-striped" class when striped prop is truthy', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Progress, {
      striped: true
    }));
    expect(wrapper.find('.progress-bar').hasClass('progress-bar-striped')).toBe(true);
  });
  it('should render with "progress-bar-striped" and "progress-bar-animated" classes when animated prop is truthy', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Progress, {
      animated: true
    }));
    expect(wrapper.find('.progress-bar').hasClass('progress-bar-striped')).toBe(true);
    expect(wrapper.find('.progress-bar').hasClass('progress-bar-animated')).toBe(true);
  });
  it('should render with "bg-${color}" class when color prop is defined', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Progress, {
      color: "yo"
    }));
    expect(wrapper.find('.progress-bar').hasClass('bg-yo')).toBe(true);
  });
  it('should render additional classes', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Progress, {
      className: "other"
    }));
    expect(wrapper.hasClass('other')).toBe(true);
    expect(wrapper.hasClass('progress')).toBe(true);
  });
  it('should render additional classes on the inner progress bar', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Progress, {
      barClassName: "other"
    }));
    expect(wrapper.hasClass('other')).toBe(false);
    expect(wrapper.hasClass('progress')).toBe(true);
    expect(wrapper.find('.progress-bar').hasClass('other')).toBe(true);
  });
  it('should render custom tag', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Progress, {
      tag: "main"
    }));
    expect(wrapper.type()).toBe('main');
  });
  it('should render only the .progress when "multi" is passed', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Progress, {
      multi: true
    }));
    expect(wrapper.type()).toBe('div');
    expect(wrapper.hasClass('progress')).toBe(true);
  });
  it('should render only the .progress-bar when "bar" is passed', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Progress, {
      bar: true
    }));
    expect(wrapper.type()).toBe('div');
    expect(wrapper.hasClass('progress-bar')).toBe(true);
  });
  it('should render additional classes', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Progress, {
      bar: true,
      className: "yo"
    }));
    expect(wrapper.type()).toBe('div');
    expect(wrapper.hasClass('progress-bar')).toBe(true);
    expect(wrapper.hasClass('yo')).toBe(true);
  });
  it('should render additional classes using the barClassName', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Progress, {
      bar: true,
      barClassName: "yo"
    }));
    expect(wrapper.type()).toBe('div');
    expect(wrapper.hasClass('progress-bar')).toBe(true);
    expect(wrapper.hasClass('yo')).toBe(true);
  });
  it('should render the children (label)', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Progress, null, "0%"));
    expect(wrapper.text()).toBe('0%');
  });
  it('should render the children (label) (multi)', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(Progress, {
      multi: true
    }, /*#__PURE__*/React.createElement(Progress, {
      bar: true,
      value: "15"
    }, "15%"), /*#__PURE__*/React.createElement(Progress, {
      bar: true,
      color: "success",
      value: "30"
    }, "30%"), /*#__PURE__*/React.createElement(Progress, {
      bar: true,
      color: "info",
      value: "25"
    }, "25%"), /*#__PURE__*/React.createElement(Progress, {
      bar: true,
      color: "warning",
      value: "20"
    }, "20%"), /*#__PURE__*/React.createElement(Progress, {
      bar: true,
      color: "danger",
      value: "5"
    }, "5%")));
    expect(wrapper.text()).toBe('15%30%25%20%5%');
  });
  it('should render nested progress bars', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(Progress, {
      multi: true
    }, /*#__PURE__*/React.createElement(Progress, {
      bar: true,
      value: "15"
    }), /*#__PURE__*/React.createElement(Progress, {
      bar: true,
      color: "success",
      value: "30"
    }), /*#__PURE__*/React.createElement(Progress, {
      bar: true,
      color: "info",
      value: "25"
    }), /*#__PURE__*/React.createElement(Progress, {
      bar: true,
      color: "warning",
      value: "20"
    }), /*#__PURE__*/React.createElement(Progress, {
      bar: true,
      color: "danger",
      value: "5"
    })));
    expect(wrapper.find('.progress').hostNodes().length).toBe(1);
    expect(wrapper.find('.progress-bar').hostNodes().length).toBe(5);
  });
  it('should render nested progress bars and id attribute', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(Progress, {
      multi: true
    }, /*#__PURE__*/React.createElement(Progress, {
      bar: true,
      id: "ruh-roh"
    })));
    expect(wrapper.find('.progress').hostNodes().length).toBe(1);
    expect(wrapper.find('#ruh-roh').hostNodes().length).toBe(1);
  });
});
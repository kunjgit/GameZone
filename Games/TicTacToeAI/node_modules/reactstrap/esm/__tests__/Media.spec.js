import React from 'react';
import { shallow } from 'enzyme';
import { Media } from '..';
describe('Media', function () {
  it('should render a div tag by default', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Media, null));
    expect(wrapper.type()).toBe('div');
  });
  it('should render an h4 tag by default for heading', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Media, {
      heading: true
    }));
    expect(wrapper.type()).toBe('h4');
  });
  it('should render an a tag by default Media with an href', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Media, {
      href: "#"
    }));
    expect(wrapper.type()).toBe('a');
  });
  it('should render an img tag by default for object', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Media, {
      object: true
    }));
    expect(wrapper.type()).toBe('img');
  });
  it('should render an img tag by default Media with a src', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Media, {
      src: "#"
    }));
    expect(wrapper.type()).toBe('img');
  });
  it('should render a ul tag by default for list', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Media, {
      list: true
    }));
    expect(wrapper.type()).toBe('ul');
  });
  it('should pass additional classNames', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Media, {
      className: "extra"
    }));
    expect(wrapper.hasClass('extra')).toBe(true);
  });
  it('should render custom tag', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Media, {
      tag: "main"
    }));
    expect(wrapper.type()).toBe('main');
  });
  it('should render body', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Media, {
      body: true
    }));
    expect(wrapper.hasClass('media-body')).toBe(true);
  });
  it('should render heading', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Media, {
      heading: true
    }));
    expect(wrapper.hasClass('media-heading')).toBe(true);
  });
  it('should render left', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Media, {
      left: true
    }));
    expect(wrapper.hasClass('media-left')).toBe(true);
  });
  it('should render right', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Media, {
      right: true
    }));
    expect(wrapper.hasClass('media-right')).toBe(true);
  });
  it('should render top', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Media, {
      top: true
    }));
    expect(wrapper.hasClass('media-top')).toBe(true);
  });
  it('should render bottom', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Media, {
      bottom: true
    }));
    expect(wrapper.hasClass('media-bottom')).toBe(true);
  });
  it('should render middle', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Media, {
      middle: true
    }));
    expect(wrapper.hasClass('media-middle')).toBe(true);
  });
  it('should render object', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Media, {
      object: true
    }));
    expect(wrapper.hasClass('media-object')).toBe(true);
  });
  it('should render media', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Media, null));
    expect(wrapper.hasClass('media')).toBe(true);
  });
  it('should render list', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Media, {
      list: true
    }, /*#__PURE__*/React.createElement(Media, {
      tag: "li"
    }), /*#__PURE__*/React.createElement(Media, {
      tag: "li"
    }), /*#__PURE__*/React.createElement(Media, {
      tag: "li"
    })));
    expect(wrapper.hasClass('media-list')).toBe(true);
    expect(wrapper.find({
      tag: 'li'
    }).length).toBe(3);
  });
  it('should render children', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Media, null, /*#__PURE__*/React.createElement(Media, {
      body: true
    })));
    expect(wrapper.find({
      body: true
    }).length).toBe(1);
  });
});
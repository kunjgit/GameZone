import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Toast } from '..';
import { testForChildrenInComponent, testForCustomAttribute, testForCustomClass, testForCustomTag, testForDefaultTag } from '../testUtils';
describe('Toast', function () {
  it('should render children', function () {
    testForChildrenInComponent(Toast);
  });
  it('should pass className down', function () {
    testForCustomClass(Toast);
  });
  it('should pass other props down', function () {
    testForCustomAttribute(Toast);
  });
  it('should have support configurable transitionTimeouts', function () {
    var transitionProps = /*#__PURE__*/React.createElement(Toast, {
      transition: {
        timeout: 0,
        appear: false,
        enter: false,
        exit: false
      }
    }, "Yo!").props.transition;
    expect(transitionProps.timeout).toEqual(0);
    expect(transitionProps.appear).toBe(false);
    expect(transitionProps.enter).toBe(false);
    expect(transitionProps.exit).toBe(false);
  });
  it('should use a div tag by default', function () {
    testForDefaultTag(Toast, 'div');
  });
  it('should support custom tag', function () {
    testForCustomTag(Toast, 'p');
  });
  it('should be empty if not isOpen', function () {
    var _render = render( /*#__PURE__*/React.createElement(Toast, {
        isOpen: false
      }, "Yo!")),
      container = _render.container;
    expect(container.children).toHaveLength(0);
  });
});